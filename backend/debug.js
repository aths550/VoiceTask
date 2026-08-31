import { extractTasksFromText } from './src/services/llmService.js';

async function run() {
  try {
    const inputA = "Rahul ko kal invoice bhejna hai, aur Saturday ko venue book karna hai, urgent hai";
    console.log("--- Hinglish Input A ---");
    const resultA = await extractTasksFromText(inputA);
    console.log(JSON.stringify(resultA, null, 2));

    const inputB = "mujhe monday ko supplier se refund maangna hai aur sarah ko bolna website copy update kare bahut zaroori hai aur haan doodh bhi lana hai";
    console.log("\\n--- Hinglish Input B ---");
    const resultB = await extractTasksFromText(inputB);
    console.log(JSON.stringify(resultB, null, 2));
  } catch (err) {
    console.error("DEBUG ERROR:", err);
  }
}
run();
