// ROUND 1: MIXED CODING (Python ONLY as requested)
// Easy questions for quick testing
export const CODING_QUESTIONS = [

  {
    id: 1,
    language: 'python',
    title: "Shopping Cart Calculator",
    description: "Fix the code to correctly calculate total price with discount and shipping.",
    buggy_code: `def calculate_total(items, discount_percent):
    total = 0
    for item in items:
        total += item['price'] * item['quantity']
    
    # Apply discount
    discount = total * discount_percent / 100
    final_total = total - discount
    
    # Add shipping if total is less than 500
    if final_total < 500
        final_total += 50
    
    return round(final_total, 2)

cart = [{'price': 100, 'quantity': 2}, {'price': 50, 'quantity': 3}]
print(calculate_total(cart, 10))`,
    expected_output: "365.0",
    hint: "Check the if condition syntax."
  },

  {
    id: 2,
    language: 'python',
    title: "Password Validator",
    description: "Fix the logic so the password validator works correctly.",
    buggy_code: `def validate_password(password):
    has_digit = False
    has_upper = False
    has_lower = False
    
    if len(password) < 8:
        return False
    
    for char in password:
        if char.isdigit():
            has_digit == True
        if char.isupper():
            has_upper = True
        if char.islower():
            has_lower = True
    
    return has_digit and has_upper and has_lower

print(validate_password("MyPass123"))`,
    expected_output: "True",
    hint: "One comparison operator is wrong."
  },

  {
    id: 3,
    language: 'python',
    title: "Email Validator",
    description: "Fix the validation logic for email format.",
    buggy_code: `def is_valid_email(email):
    if "@" not in email:
        return False
    
    parts = email.split("@")
    
    if len(parts) != 2:
        return False
    
    username = parts[0]
    domain = parts[1]
    
    if len(username) == 0 or len(domain) = 0:
        return False
    
    return "." in domain

print(is_valid_email("user@example.com"))`,
    expected_output: "True",
    hint: "There is an assignment operator mistake."
  },

  {
    id: 4,
    language: 'python',
    title: "Word Frequency Counter",
    description: "Fix the dictionary update logic.",
    buggy_code: `def count_words(sentence):
    words = sentence.lower().split()
    frequency = {}
    
    for word in words:
        # Remove punctuation
        clean_word = word.strip(".,!?;:")
        
        if clean_word in frequency:
            frequency[clean_word] += 1
        else:
            frequency[clean_word] == 1
    
    return frequency

text = "Hello world, hello Python, Python is great"
result = count_words(text)
print(result)`,
    expected_output: "{'hello': 2, 'world': 1, 'python': 2, 'is': 1, 'great': 1}",
    hint: "Dictionary assignment is incorrect."
  },

  {
    id: 5,
    language: 'python',
    title: "Movie Ticket Booking",
    description: "Fix the conditional statement for matinee discount.",
    buggy_code: `def book_tickets(age, num_tickets, show_time):
    ticket_price = 200
    
    # Senior citizen discount
    if age >= 60:
        ticket_price = 150
    # Child discount
    elif age < 12:
        ticket_price = 100
    
    total = ticket_price * num_tickets
    
    # Matinee show discount
    if show_time == "matinee"
        total = total * 0.8
    
    return f"Total: Rs. {total}"

print(book_tickets(65, 2, "matinee"))`,
    expected_output: "Total: Rs. 240.0",
    hint: "Check missing colon in condition."
  }
];


// ROUND 2: REACT DEBUGGING
// Easy questions for quick testing — pure JSX, no imports
export const REACT_QUESTIONS = [
  {
    id: 1,
    language: "react",
    title: "Toggle Theme",
    difficulty: "Easy",
    description: "Create a React component with default theme as light. Toggle between light and dark when button is clicked. Background and text color should change accordingly.",
    buggy_code: `import React from "react";

export default function ToggleTheme() {
  // Your code here
}`,
    expected_output: "Theme toggles between Light and Dark",
    hint: "Use useState to store theme and toggle it on button click.",
    testCases: [
      "Initial render → Light theme",
      "Click button once → Dark theme",
      "Click again → Light theme",
      "Background and text color update correctly"
    ],
    solution: `import React, { useState } from "react";

export default function ToggleTheme() {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const style = {
    backgroundColor: theme === "light" ? "#ffffff" : "#222222",
    color: theme === "light" ? "#000000" : "#ffffff",
    height: "100vh",
    padding: "20px"
  };

  return (
    <div style={style}>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <h2>Current Theme: {theme}</h2>
    </div>
  );
}`
  },

  {
    id: 2,
    language: "react",
    title: "Increment up to 5",
    difficulty: "Easy",
    description: "Create a counter using useState that increments when button is clicked. Stop incrementing at 5 and disable the button at 5.",
    buggy_code: `import React from "react";

export default function Counter() {
  // Your code here
}`,
    expected_output: "Counter increments until 5 then disables",
    hint: "Use state and disable button when count >= 5.",
    testCases: [
      "Click once → Count = 1",
      "Click three times → Count = 3",
      "Click five times → Count = 5",
      "Click after five → Count remains 5",
      "At count 5 → Button disabled"
    ],
    solution: `import React, { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>{count}</h2>
      <button 
        onClick={() => setCount(count + 1)} 
        disabled={count >= 5}
      >
        Increment
      </button>
    </div>
  );
}`
  },

  {
    id: 3,
    language: "react",
    title: "Dynamic Input Display",
    difficulty: "Easy",
    description: "Create an input field where user types text and the same text appears dynamically below inside a p tag.",
    buggy_code: `import React from "react";

export default function LiveInput() {
  // Your code here
}`,
    expected_output: "Typed text appears below input dynamically",
    hint: "Use onChange and state binding.",
    testCases: [
      "Input 'Hello' → Displays Hello",
      "Input 'React' → Displays React",
      "Clear input → Displays empty string"
    ],
    solution: `import React, { useState } from "react";

export default function LiveInput() {
  const [text, setText] = useState("");

  return (
    <div>
      <input 
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type something..."
      />
      <p>{text}</p>
    </div>
  );
}`
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
