# Sample Solutions Guide

This guide provides solutions for the sample problems included in WSES.

## Problem 1: Two Sum

**Difficulty:** Easy

### Problem Description
Given an array of integers and a target, return the sum of any two numbers that add up to the target.

### Input Format
```
4
2 7 11 15
9
```

### Expected Output
```
9
```

### Solutions

#### Python
```python
# Read input
n = int(input())
arr = list(map(int, input().split()))
target = int(input())

# Find two numbers that sum to target
for i in range(n):
    for j in range(i + 1, n):
        if arr[i] + arr[j] == target:
            print(target)
            break
```

#### JavaScript
```javascript
// Read input
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let lines = [];
rl.on('line', (line) => {
    lines.push(line);
}).on('close', () => {
    const n = parseInt(lines[0]);
    const arr = lines[1].split(' ').map(Number);
    const target = parseInt(lines[2]);
    
    // Find two numbers that sum to target
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            if (arr[i] + arr[j] === target) {
                console.log(target);
                return;
            }
        }
    }
});
```

#### C++
```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, target;
    cin >> n;
    
    vector<int> arr(n);
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    
    cin >> target;
    
    // Find two numbers that sum to target
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (arr[i] + arr[j] == target) {
                cout << target << endl;
                return 0;
            }
        }
    }
    
    return 0;
}
```

#### C
```c
#include <stdio.h>

int main() {
    int n, target;
    scanf("%d", &n);
    
    int arr[n];
    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }
    
    scanf("%d", &target);
    
    // Find two numbers that sum to target
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (arr[i] + arr[j] == target) {
                printf("%d\n", target);
                return 0;
            }
        }
    }
    
    return 0;
}
```

#### Java
```java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        int n = scanner.nextInt();
        int[] arr = new int[n];
        
        for (int i = 0; i < n; i++) {
            arr[i] = scanner.nextInt();
        }
        
        int target = scanner.nextInt();
        
        // Find two numbers that sum to target
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                if (arr[i] + arr[j] == target) {
                    System.out.println(target);
                    return;
                }
            }
        }
        
        scanner.close();
    }
}
```

---

## Problem 2: Reverse String

**Difficulty:** Easy

### Problem Description
Given a string, reverse it and print the result.

### Input Format
```
hello
```

### Expected Output
```
olleh
```

### Solutions

#### Python
```python
# Read input
s = input()

# Reverse and print
print(s[::-1])
```

#### JavaScript
```javascript
// Read input
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (s) => {
    // Reverse and print
    console.log(s.split('').reverse().join(''));
    rl.close();
});
```

#### C++
```cpp
#include <iostream>
#include <string>
#include <algorithm>
using namespace std;

int main() {
    string s;
    cin >> s;
    
    // Reverse
    reverse(s.begin(), s.end());
    
    cout << s << endl;
    return 0;
}
```

#### C
```c
#include <stdio.h>
#include <string.h>

int main() {
    char s[1001];
    scanf("%s", s);
    
    int len = strlen(s);
    
    // Reverse
    for (int i = len - 1; i >= 0; i--) {
        printf("%c", s[i]);
    }
    printf("\n");
    
    return 0;
}
```

#### Java
```java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String s = scanner.next();
        
        // Reverse
        String reversed = new StringBuilder(s).reverse().toString();
        System.out.println(reversed);
        
        scanner.close();
    }
}
```

---

## Problem 3: Factorial

**Difficulty:** Easy

### Problem Description
Calculate the factorial of a given number n.

### Input Format
```
5
```

### Expected Output
```
120
```

### Solutions

#### Python
```python
# Read input
n = int(input())

# Calculate factorial
factorial = 1
for i in range(1, n + 1):
    factorial *= i

print(factorial)
```

#### JavaScript
```javascript
// Read input
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (line) => {
    const n = parseInt(line);
    
    // Calculate factorial
    let factorial = 1;
    for (let i = 1; i <= n; i++) {
        factorial *= i;
    }
    
    console.log(factorial);
    rl.close();
});
```

#### C++
```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    
    // Calculate factorial
    long long factorial = 1;
    for (int i = 1; i <= n; i++) {
        factorial *= i;
    }
    
    cout << factorial << endl;
    return 0;
}
```

#### C
```c
#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    
    // Calculate factorial
    long long factorial = 1;
    for (int i = 1; i <= n; i++) {
        factorial *= i;
    }
    
    printf("%lld\n", factorial);
    return 0;
}
```

#### Java
```java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        
        // Calculate factorial
        long factorial = 1;
        for (int i = 1; i <= n; i++) {
            factorial *= i;
        }
        
        System.out.println(factorial);
        scanner.close();
    }
}
```

---

## Testing Wrong Answers

To test the "Wrong Answer" verdict, submit incorrect solutions:

### Two Sum - Wrong Answer
```python
# Always print 0 (incorrect)
n = int(input())
arr = list(map(int, input().split()))
target = int(input())
print(0)
```

### Reverse String - Wrong Answer
```python
# Don't reverse (incorrect)
s = input()
print(s)
```

### Factorial - Wrong Answer
```python
# Always print 1 (incorrect)
n = int(input())
print(1)
```

---

## Testing Time Limit Exceeded

Submit solutions with infinite loops:

```python
# Infinite loop
while True:
    pass
```

---

## Testing Compilation Errors

Submit code with syntax errors:

```python
# Missing closing parenthesis
def foo(
    print("hello")
```

```cpp
// Missing semicolon
#include <iostream>
using namespace std;

int main() {
    cout << "hello"  // Missing semicolon
    return 0;
}
```

---

## Tips for Problem Solving

1. **Read Carefully**: Understand input/output format
2. **Test Samples**: Verify with provided test cases
3. **Edge Cases**: Consider boundary conditions
4. **Time Complexity**: Avoid nested loops for large inputs
5. **Data Types**: Use appropriate types (int, long, etc.)

## Common Pitfalls

1. **Input Format**: Match exact format (newlines, spaces)
2. **Output Format**: Print exactly as specified
3. **Edge Cases**: Test with 0, negative numbers, etc.
4. **Integer Overflow**: Use long/long long for large numbers
5. **Infinite Loops**: Always have exit condition

## Language-Specific Notes

### Python
- Use `input()` for reading lines
- Use `int()`, `map()`, `split()` for parsing
- String slicing: `s[::-1]` for reverse

### JavaScript (Node.js)
- Use `readline` module for input
- Store lines in array
- Process in 'close' event

### C++
- Use `cin` for input
- Use `cout` for output
- Include necessary headers

### C
- Use `scanf` for input
- Use `printf` for output
- Be careful with buffer sizes

### Java
- Use `Scanner` for input
- Class name must be `Main`
- Close scanner at end

## How to Submit

1. Navigate to problem page
2. Select language from dropdown
3. Write/paste your code
4. Click "Submit"
5. Wait for verdict (1-3 seconds)
6. See result and metrics

## Understanding Verdicts

- **Accepted (AC)**: All test cases passed ✅
- **Wrong Answer (WA)**: Output doesn't match ❌
- **Time Limit Exceeded (TLE)**: Took too long ⏱️
- **Compilation Error (CE)**: Code doesn't compile 🔴
- **Runtime Error (RE)**: Code crashed 💥
- **Pending**: Still being judged ⏳

## Need Help?

- Review problem description carefully
- Check sample inputs/outputs
- Test locally before submitting
- Start with simple approach
- Optimize if needed

Happy coding! 🚀
