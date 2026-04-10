import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/prisma";
import { calculateDueDate } from "@/service/knowledge-test";

function makeBlock(
  id: string,
  type: string,
  content: { type: string; text: string; styles?: Record<string, unknown> }[],
  props?: Record<string, unknown>,
  children?: unknown[]
) {
  return {
    id,
    type,
    props: {
      textColor: "default",
      backgroundColor: "default",
      textAlignment: "left",
      ...props,
    },
    content,
    children: children ?? [],
  };
}

function text(t: string, styles: Record<string, unknown> = {}) {
  return { type: "text" as const, text: t, styles };
}

export async function createSampleLearn(email: string) {
  try {
    // Step A — Create learn + 3 notebooks
    const learn = await prisma.learn.create({
      data: {
        title: "JS Sample Learn",
        description:
          "You can use this learn as your starting point to explore Elearner's features, this learn contains pre made notebooks, flashcards, practice tasks and resources",
        user_id: email,
        noteFiles: {
          create: [
            { title: "How to declare variables" },
            { title: "const vs let vs var" },
            { title: "arrow function vs normal function" },
          ],
        },
      },
      include: { noteFiles: { orderBy: { id: "asc" } } },
    });

    const [nb1, nb2, nb3] = learn.noteFiles;
    const learnId = learn.id;

    // Step B — Blocks for notebook 1: "How to declare variables"
    const nb1Blocks = [
      {
        id: crypto.randomUUID(),
        type: "bulletListItem",
        data: makeBlock(
          crypto.randomUUID(),
          "bulletListItem",
          [
            text("In this notebook, you can write your notes and thoughts related to "),
            text("variable declaration", { bold: true }),
            text(" in JS"),
          ]
        ),
        file_id: nb1.id,
        order: 0,
      },
      {
        id: crypto.randomUUID(),
        type: "bulletListItem",
        data: makeBlock(
          crypto.randomUUID(),
          "bulletListItem",
          [
            text("Also you can create "),
            text("Flashcard", { italic: true }),
            text(" and "),
            text("Practice Task", { italic: true }),
            text(" using the options above"),
          ]
        ),
        file_id: nb1.id,
        order: 1,
      },
      {
        id: crypto.randomUUID(),
        type: "bulletListItem",
        data: makeBlock(
          crypto.randomUUID(),
          "bulletListItem",
          [
            text("This learn already includes "),
            text("flashcards", { italic: true }),
            text(" and "),
            text("practice tasks", { italic: true }),
            text(
              " as samples for you, they will be available for review by the next day of your registration in the platform"
            ),
          ]
        ),
        file_id: nb1.id,
        order: 2,
      },
      {
        id: crypto.randomUUID(),
        type: "bulletListItem",
        data: makeBlock(
          crypto.randomUUID(),
          "bulletListItem",
          [text("You can also update/remove them from the sidebar")]
        ),
        file_id: nb1.id,
        order: 3,
      },
      {
        id: crypto.randomUUID(),
        type: "bulletListItem",
        data: makeBlock(
          crypto.randomUUID(),
          "bulletListItem",
          [
            text(
              "Also there're other notebooks that contains real notes about different topics in JS"
            ),
          ]
        ),
        file_id: nb1.id,
        order: 4,
      },
    ];

    // Fix block IDs to match row IDs
    nb1Blocks.forEach((b) => {
      (b.data as any).id = b.id;
    });

    await prisma.noteFileBlock.createMany({ data: nb1Blocks });

    // Step C — Blocks for notebook 2: "const vs let vs var"
    const nb2Blocks = [
      {
        id: crypto.randomUUID(),
        type: "paragraph",
        data: makeBlock(crypto.randomUUID(), "paragraph", [
          text("In JavaScript, "),
          text("var", { code: true }),
          text(", "),
          text("let", { code: true }),
          text(", and "),
          text("const", { code: true }),
          text(
            " are used to declare variables, but they differ significantly in scope, reassignment, and how the JavaScript engine handles them during execution."
          ),
        ]),
        file_id: nb2.id,
        order: 0,
      },
      {
        id: crypto.randomUUID(),
        type: "heading",
        data: makeBlock(
          crypto.randomUUID(),
          "heading",
          [text("Detailed Differences")],
          { level: 2 }
        ),
        file_id: nb2.id,
        order: 1,
      },
      {
        id: crypto.randomUUID(),
        type: "bulletListItem",
        data: makeBlock(
          crypto.randomUUID(),
          "bulletListItem",
          [text("Scope", { bold: true })],
          {},
          [
            makeBlock(crypto.randomUUID(), "bulletListItem", [
              text("var", { code: true }),
              text(
                ": Scoped to the entire function where it's declared. If declared outside a function, it is globally scoped."
              ),
            ]),
            makeBlock(crypto.randomUUID(), "bulletListItem", [
              text("let", { code: true }),
              text(" & "),
              text("const", { code: true }),
              text(
                ": Scoped to the immediate block (delimited by { }), such as an if statement or a for loop."
              ),
            ]),
          ]
        ),
        file_id: nb2.id,
        order: 2,
      },
      {
        id: crypto.randomUUID(),
        type: "bulletListItem",
        data: makeBlock(
          crypto.randomUUID(),
          "bulletListItem",
          [text("Reassignment vs. Mutation", { bold: true })],
          {},
          [
            makeBlock(crypto.randomUUID(), "bulletListItem", [
              text("let", { code: true }),
              text(": Can be reassigned a new value later in the code."),
            ]),
            makeBlock(crypto.randomUUID(), "bulletListItem", [
              text("const", { code: true }),
              text(
                ": Cannot be reassigned. Attempting to do so will throw a TypeError. However, if a const holds an object or array, the contents (properties or elements) can still be mutated."
              ),
            ]),
          ]
        ),
        file_id: nb2.id,
        order: 3,
      },
      {
        id: crypto.randomUUID(),
        type: "bulletListItem",
        data: makeBlock(
          crypto.randomUUID(),
          "bulletListItem",
          [text("Hoisting & Temporal Dead Zone (TDZ)", { bold: true })],
          {},
          [
            makeBlock(crypto.randomUUID(), "bulletListItem", [
              text("var", { code: true }),
              text(
                ": Declarations are moved to the top of their scope and initialized as undefined, allowing them to be accessed before the line they are declared."
              ),
            ]),
            makeBlock(crypto.randomUUID(), "bulletListItem", [
              text("let", { code: true }),
              text(" & "),
              text("const", { code: true }),
              text(
                ": Declarations are hoisted but remain uninitialized. Accessing them before the declaration results in a ReferenceError because they are in the Temporal Dead Zone."
              ),
            ]),
          ]
        ),
        file_id: nb2.id,
        order: 4,
      },
      {
        id: crypto.randomUUID(),
        type: "bulletListItem",
        data: makeBlock(
          crypto.randomUUID(),
          "bulletListItem",
          [text("Redeclaration", { bold: true })],
          {},
          [
            makeBlock(crypto.randomUUID(), "bulletListItem", [
              text("You can redeclare a "),
              text("var", { code: true }),
              text(" variable in the same scope without error."),
            ]),
            makeBlock(crypto.randomUUID(), "bulletListItem", [
              text("Both "),
              text("let", { code: true }),
              text(" and "),
              text("const", { code: true }),
              text(
                " will throw a SyntaxError if you try to redeclare them in the same scope."
              ),
            ]),
          ]
        ),
        file_id: nb2.id,
        order: 5,
      },
    ];

    nb2Blocks.forEach((b) => {
      (b.data as any).id = b.id;
    });

    await prisma.noteFileBlock.createMany({ data: nb2Blocks });

    // Step D — Blocks for notebook 3: "arrow function vs normal function"
    const nb3Blocks = [
      {
        id: crypto.randomUUID(),
        type: "paragraph",
        data: makeBlock(crypto.randomUUID(), "paragraph", [
          text(
            "In JavaScript, arrow functions (introduced in ES6) and regular functions serve the same purpose but have significant behavioral and syntactic differences."
          ),
        ]),
        file_id: nb3.id,
        order: 0,
      },
      {
        id: crypto.randomUUID(),
        type: "paragraph",
        data: makeBlock(crypto.randomUUID(), "paragraph", [
          text("1. The ", { bold: true }),
          text("this", { bold: true, code: true }),
          text(" Keyword", { bold: true }),
        ]),
        file_id: nb3.id,
        order: 1,
      },
      {
        id: crypto.randomUUID(),
        type: "paragraph",
        data: makeBlock(crypto.randomUUID(), "paragraph", [
          text(
            "The most critical difference is how they handle the this context."
          ),
        ]),
        file_id: nb3.id,
        order: 2,
      },
      {
        id: crypto.randomUUID(),
        type: "bulletListItem",
        data: makeBlock(crypto.randomUUID(), "bulletListItem", [
          text("Regular Functions: ", { bold: true }),
          text(
            "Define their own this based on the calling context. If a method is called on an object, this refers to that object."
          ),
        ]),
        file_id: nb3.id,
        order: 3,
      },
      {
        id: crypto.randomUUID(),
        type: "bulletListItem",
        data: makeBlock(crypto.randomUUID(), "bulletListItem", [
          text("Arrow Functions: ", { bold: true }),
          text("Do "),
          text("not", { bold: true }),
          text(
            " have their own this. They inherit this from the surrounding parent scope (lexical scope). This makes them ideal for callbacks where you want to keep the same this context."
          ),
        ]),
        file_id: nb3.id,
        order: 4,
      },
      {
        id: crypto.randomUUID(),
        type: "paragraph",
        data: makeBlock(crypto.randomUUID(), "paragraph", [
          text("2. Syntax & Return", { bold: true }),
        ]),
        file_id: nb3.id,
        order: 5,
      },
      {
        id: crypto.randomUUID(),
        type: "paragraph",
        data: makeBlock(crypto.randomUUID(), "paragraph", [
          text(
            "Arrow functions offer a much shorter syntax, especially for simple logic."
          ),
        ]),
        file_id: nb3.id,
        order: 6,
      },
      {
        id: crypto.randomUUID(),
        type: "bulletListItem",
        data: makeBlock(crypto.randomUUID(), "bulletListItem", [
          text("Implicit Return: ", { bold: true }),
          text(
            "In an arrow function, if you omit the curly braces, the expression is automatically returned."
          ),
        ]),
        file_id: nb3.id,
        order: 7,
      },
      {
        id: crypto.randomUUID(),
        type: "codeBlock",
        data: makeBlock(
          crypto.randomUUID(),
          "codeBlock",
          [
            text(
              "// Regular Function\nconst add = function(a, b) { return a + b; };\n// Arrow Function (Implicit return)\nconst add = (a, b) => a + b;"
            ),
          ],
          { language: "javascript" }
        ),
        file_id: nb3.id,
        order: 8,
      },
      {
        id: crypto.randomUUID(),
        type: "bulletListItem",
        data: makeBlock(crypto.randomUUID(), "bulletListItem", [
          text("Parentheses: "),
          text(
            "You can omit parentheses for a single parameter, but they are required for zero or multiple parameters."
          ),
        ]),
        file_id: nb3.id,
        order: 9,
      },
    ];

    nb3Blocks.forEach((b) => {
      (b.data as any).id = b.id;
    });

    await prisma.noteFileBlock.createMany({ data: nb3Blocks });

    // Step E — 3 flashcards
    const due = calculateDueDate(0);
    await prisma.flashCard.createMany({
      data: [
        {
          learn_id: learnId,
          question: "How to declare a variable in JS",
          answer:
            "In JavaScript, you declare a variable using one of three keywords: let, const, or var",
          answerType: "open-ended",
          options: Prisma.DbNull,
          hint: null,
          stage: "0",
          due,
        },
        {
          learn_id: learnId,
          question: "const allows you to reassign the variable",
          answer: "false",
          answerType: "true-false",
          options: Prisma.DbNull,
          hint: null,
          stage: "0",
          due,
        },
        {
          learn_id: learnId,
          question:
            "If you want your variables to be block-scoped and need to reassign it, what type would you use ?",
          answer: "let",
          answerType: "multiple-choices",
          options: ["let", "const", "var"],
          hint: null,
          stage: "0",
          due,
        },
      ],
    });

    // Step F — 1 practice task
    await prisma.practiceTask.create({
      data: {
        learn_id: learnId,
        title: "Declare a variable and log it",
        description: `## Declaring variables that can be reassigned

1. Declare a variable named \`name\` with value of \`x\`

2. Log this value to the console

3. After logging this value, reassign this variable to \`y\`

## Declaring constant variables

1. Declare a variable named \`name\` with value of \`x\` and make it constant

2. Log this value to the console`,
        stage: "0",
        due,
      },
    });

    // Step G — Resources
    await prisma.resource.createMany({
      data: [
        {
          title: "how to declare variables ?",
          link: "https://www.w3schools.com/js/js_variables.asp",
          learn_id: learnId,
        },
        {
          title: "const in details",
          link: "https://www.w3schools.com/js/js_const.asp",
          learn_id: learnId,
        },
      ],
    });

    const folder = await prisma.resource.create({
      data: { title: "functions", learn_id: learnId },
    });

    await prisma.resource.createMany({
      data: [
        {
          title: "arrow function",
          link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions",
          learn_id: learnId,
          parentResource: folder.id,
        },
        {
          title: "different types of functions",
          link: "https://medium.com/@anands8196/different-types-of-functions-in-javascript-a-comprehensive-guide-795928ac5613",
          learn_id: learnId,
          parentResource: folder.id,
        },
      ],
    });

    // Step H — Set flag
    await prisma.user.update({
      where: { email },
      data: { sampleLearnsCreated: true },
    });
  } catch (err) {
    console.error("[createSampleLearn] failed:", err);
  }
}
