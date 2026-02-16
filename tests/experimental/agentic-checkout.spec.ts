import { test, expect } from '@playwright/test';
import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import yaml from 'js-yaml';
import * as dotenv from 'dotenv';

dotenv.config();

// Safe initialization: only create the client if the key exists
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) 
  : null;

/**
 * Agentic Test Helper
 * Uses GPT-4 Vision to understand the page and decide what actions to take
 */
class AgenticTestAgent {
  constructor(private page: any) {}

  /**
   * Ask the AI agent to perform a task using natural language
   */
  async performTask(instruction: string): Promise<string> {
    if (!openai) {
      throw new Error('OpenAI client not initialized. Please set OPENAI_API_KEY.');
    }

    console.log(`\n🤖 Agent Task: ${instruction}`);
    
    const screenshot = await this.page.screenshot({ encoding: 'base64' });
    const pageTitle = await this.page.title();
    const currentUrl = this.page.url();

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert test automation agent. Return ONLY valid Playwright code. Use data-test attributes. Format: await page.locator("selector").action()'
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `URL: ${currentUrl}\nTitle: ${pageTitle}\nTask: ${instruction}\n\nProvide Playwright command(s).`
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/png;base64,${screenshot}`,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    return response.choices[0].message.content || '';
  }

  async executeAgentCommand(command: string): Promise<void> {
    try {
      let cleanCommand = command
        .replace(/```typescript\n?/g, '')
        .replace(/```javascript\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      const commands = cleanCommand.split(';').map(c => c.trim()).filter(c => c);

      for (const cmd of commands) {
        if (cmd) {
          console.log(`⚡ Executing: ${cmd}`);
          await eval(cmd);
          await this.page.waitForTimeout(1000);
        }
      }
    } catch (error: any) {
      console.error(`❌ Execution failed: ${error.message}`);
      throw error;
    }
  }

  async do(instruction: string): Promise<void> {
    const command = await this.performTask(instruction);
    await this.executeAgentCommand(command);
  }

  async verify(expectation: string): Promise<boolean> {
    if (!openai) {
      throw new Error('OpenAI client not initialized.');
    }

    console.log(`\n🔍 Verifying: ${expectation}`);
    const screenshot = await this.page.screenshot({ encoding: 'base64' });

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Analyze screenshot and answer YES or NO.',
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Question: ${expectation}\nAnswer ONLY YES or NO.`
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/png;base64,${screenshot}`,
              },
            },
          ],
        },
      ],
      max_tokens: 10,
    });

    const answer = response.choices[0].message.content?.trim().toUpperCase() || 'NO';
    console.log(`✅ Result: ${answer}`);
    return answer === 'YES';
  }
}

test.describe('Agentic Automation - YAML Driven', () => {
  test.skip(!process.env.OPENAI_API_KEY, 'Skipping: OpenAI API Key not found');

  test('Execute checkout via YAML instructions @experimental @agentic', async ({ page }) => {
    const yamlPath = path.join(__dirname, 'checkout-instructions.yaml');
    const config: any = yaml.load(fs.readFileSync(yamlPath, 'utf8'));
    
    console.log(`\n🚀 Starting Agentic Test: ${config.test_name}`);
    const agent = new AgenticTestAgent(page);

    await page.goto('https://www.saucedemo.com');

    for (const step of config.steps) {
      console.log(`\n📝 Step: "${step}"`);
      if (step.toLowerCase().includes('verify')) {
        const success = await agent.verify(step);
        expect(success).toBe(true);
      } else {
        await agent.do(step);
      }
    }
  });
});