// ROUND 1: MIXED CODING (Python, Java, JavaScript)
// Easy questions for quick testing
export const CODING_QUESTIONS = [
  {
    id: 1,
    language: 'python',
    title: "Hello World",
    description: "Fix the print statement to display 'Hello'.",
    buggy_code: `# Fix the typo
prnt("Hello")`,
    expected_output: "Hello",
    hint: "The function name is 'print'."
  },
  {
    id: 2,
    language: 'python',
    title: "Simple Addition",
    description: "Fix the code to print the sum of 10 + 20.",
    buggy_code: `a = 10
b = 20
print(a - b)`,
    expected_output: "30",
    hint: "Use '+' operator."
  },
  {
    id: 3,
    language: 'python',
    title: "List Access",
    description: "Print the first item of the list.",
    buggy_code: `items = ["Apple", "Banana", "Cherry"]
print(items[1])`,
    expected_output: "Apple",
    hint: "Python lists are 0-indexed."
  },
  {
    id: 4,
    language: 'python',
    title: "String Upper",
    description: "Convert the string 'code' to uppercase.",
    buggy_code: `text = "code"
print(text.upper_case())`,
    expected_output: "CODE",
    hint: "The method is .upper()."
  },
  {
    id: 5,
    language: 'python',
    title: "Loop Range",
    description: "Print numbers 0 to 2 (one per line).",
    buggy_code: `for i in range(1, 3):
    print(i)`,
    expected_output: "0\n1\n2",
    hint: "range(start, end) excludes end. Default start is 0."
  }
];

// ROUND 2: REACT DEBUGGING
// Easy questions for quick testing — pure JSX, no imports
export const REACT_QUESTIONS = [
  {
    id: 1,
    title: "Add Click Handler",
    description: "The button does nothing when clicked. Add an onClick handler to call handleClick.",
    buggy_code: `function App() {
  function handleClick() {
    alert("Clicked!");
  }

  return (
    <button>Click Me</button>
  );
}`,
    success_condition: "Button shows alert on click"
  },
  {
    id: 2,
    title: "Fix Counter",
    description: "The counter doesn't update. You can't assign directly to a state variable — use setCount() instead.",
    buggy_code: `function App() {
  const [count, setCount] = React.useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => count = count + 1}>Add</button>
    </div>
  );
}`,
    success_condition: "Counter increments when button is clicked"
  },
  {
    id: 3,
    title: "Show / Hide Text",
    description: "The secret text is always visible. Use conditional rendering with {show && ...} to toggle it.",
    buggy_code: `function App() {
  const [show, setShow] = React.useState(false);

  return (
    <div>
      <button onClick={() => setShow(!show)}>Toggle</button>
      <p>Secret Message</p>
    </div>
  );
}`,
    success_condition: "Text toggles on button click"
  }
];

// ROUND 3 (Now Option in Round 2): JAVA CHALLENGES
export const JAVA_QUESTIONS = [
  {
    id: 'java1',
    title: "Even or Odd Checker",
    difficulty: "Easy",
    description: "Write a Java program that takes an integer as input and prints whether the number is Even or Odd.\n\nLogic:\n1. Take integer input\n2. Use modulus operator (%) to check remainder when divided by 2\n3. If remainder is 0 → print Even\n4. Else → print Odd",
    starter_code: `import java.util.Scanner;\n\npublic class EvenOdd {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}`,
    test_cases: [
      { input: "4", output: "Even" },
      { input: "7", output: "Odd" },
      { input: "0", output: "Even" }
    ]
  },
  {
    id: 'java2',
    title: "Reverse a String",
    difficulty: "Easy",
    description: "Write a Java program that takes a string input and prints the reversed string.\n\nLogic:\n1. Take string input\n2. Traverse string from last index to first\n3. Build reversed string using loop\n4. Print reversed result",
    starter_code: `import java.util.Scanner;\n\npublic class ReverseString {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}`,
    test_cases: [
      { input: "hello", output: "olleh" },
      { input: "Java", output: "avaJ" },
      { input: "a", output: "a" }
    ]
  },
  {
    id: 'java3',
    title: "Find Maximum in Array",
    difficulty: "Easy",
    description: "Write a Java program that takes N integers as input and prints the maximum number.\n\nLogic:\n1. Take size of array\n2. Store integers in array\n3. Assume first element as max\n4. Traverse array and compare each element\n5. Update max when larger value found\n6. Print max",
    starter_code: `import java.util.Scanner;\n\npublic class MaxArray {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}`,
    test_cases: [
      { input: "5 (Elements: 1 2 3 4 5)", output: "5" },
      { input: "4 (Elements: 10 5 8 2)", output: "10" },
      { input: "3 (Elements: -1 -5 -3)", output: "-1" }
    ]
  },
  {
    id: 'java4',
    title: "Count Even Digits",
    difficulty: "Easy",
    description: "Write a Java program that counts how many even digits are present in a number.\n\nLogic:\n1. Take integer input\n2. Extract digits using modulus (%)\n3. Check if each digit is even\n4. Maintain counter variable\n5. Print total count",
    starter_code: `import java.util.Scanner;\n\npublic class CountEvenDigits {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}`,
    test_cases: [
      { input: "123456", output: "3" },
      { input: "2468", output: "4" },
      { input: "1357", output: "0" }
    ]
  }
];
