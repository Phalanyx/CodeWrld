/*
Note: This code is sourced from ChatGPT-4o.
It is used to generate detailed fake data for the database to test the application.
*/

import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const languages = ['javascript', 'python', 'cpp', 'c', 'java', 'ruby', 'rust', 'swift', 'r', 'php', 'go', 'dart'];

const languageCodeSamples: { [key: string]: (i: number) => string } = {
  javascript: (i: number) => `
// JavaScript Example ${i}
// FizzBuzz Algorithm
for (let num = 1; num <= 15; num++) {
  if (num % 3 === 0 && num % 5 === 0) console.log('FizzBuzz');
  else if (num % 3 === 0) console.log('Fizz');
  else if (num % 5 === 0) console.log('Buzz');
  else console.log(num);
}
`,
  python: (i: number) => `
# Python Example ${i}
# Prime Number Check
n = 29
is_prime = True
for i in range(2, int(n ** 0.5) + 1):
    if n % i == 0:
        is_prime = False
        break
if is_prime:
    print(f"{n} is a prime number.")
else:
    print(f"{n} is not a prime number.")
`,
  cpp: (i: number) => `
// C++ Example ${i}
// Fibonacci Sequence
#include <iostream>
using namespace std;

int main() {
    int t1 = 0, t2 = 1, nextTerm = 0, n = 10;
    cout << "Fibonacci Sequence up to " << n << " terms: ";
    for (int i = 1; i <= n; ++i) {
        cout << t1 << " ";
        nextTerm = t1 + t2;
        t1 = t2;
        t2 = nextTerm;
    }
    return 0;
}
`,
    dart: (i: number) => `
  // Dart Example ${i}
  // Simple Dart Program: Calculate the Sum of an Array
  void main() {
    List<int> numbers = [1, 2, 3, 4, 5];
    int sum = numbers.reduce((a, b) => a + b);
    print('Sum of the array: \$sum');
  }
  `,
    c: (i: number) => `
  // C Example ${i}
  // Factorial Calculation
  #include <stdio.h>
  
  int factorial(int n) {
      if (n == 0) return 1;
      return n * factorial(n - 1);
  }
  
  int main() {
      int num = 5;
      printf("Factorial of %d is %d", num, factorial(num));
      return 0;
  }
  `,
    java: (i: number) => `
  // Java Example ${i}
  // Palindrome Check
  public class Palindrome {
      public static void main(String[] args) {
          String str = "madam";
          String reversedStr = new StringBuilder(str).reverse().toString();
          if (str.equals(reversedStr)) {
              System.out.println(str + " is a palindrome.");
          } else {
              System.out.println(str + " is not a palindrome.");
          }
      }
  }
  `,
    ruby: (i: number) => `
  // Ruby Example ${i}
  // Sum of Array Elements
  arr = [1, 2, 3, 4, 5]
  sum = arr.reduce(0) { |acc, num| acc + num }
  puts "Sum of the array: #{sum}"
  `,
    rust: (i: number) => `
  // Rust Example ${i}
  // Calculate the Sum of an Array
  fn main() {
      let numbers = [1, 2, 3, 4, 5];
      let sum: i32 = numbers.iter().sum();
      println!("Sum of the array: {}", sum);
  }
  `,
    swift: (i: number) => `
  // Swift Example ${i}
  // Check if a Number is Even or Odd
  let number = 4
  if number % 2 == 0 {
      print("\\(number) is even")
  } else {
      print("\\(number) is odd")
  }
  `,
    r: (i: number) => `
  // R Example ${i}
  // Calculate the Mean of a Vector
  numbers <- c(1, 2, 3, 4, 5)
  mean_value <- mean(numbers)
  print(paste("Mean of the vector:", mean_value))
  `,
    php: (i: number) => `
  // PHP Example ${i}
  // Reverse a String
  $str = "Hello, World!";
  $reversedStr = strrev($str);
  echo "Reversed string: " . $reversedStr;
  `,
    go: (i: number) => `
  // Go Example ${i}
  // Find the Maximum Element in an Array
  package main
  
  import "fmt"
  
  func main() {
      numbers := []int{1, 2, 3, 4, 5}
      max := numbers[0]
      for _, num := range numbers {
          if num > max {
              max = num
          }
      }
      fmt.Println("Maximum element:", max)
  }
  `,
  };

async function main() {
  const admin = await prisma.user.create({
    data: {
      userName: 'adminUser',
      firstName: 'Alex',
      lastName: 'Morgan',
      email: 'admin@example.com',
      avatar: faker.image.avatar(),
      phoneNumber: faker.phone.number(),
      password: '123',
      role: 'admin',
    },
  });

  const users = await Promise.all(
    Array.from({ length: 5 }).map(() =>
      prisma.user.create({
        data: {
          userName: faker.internet.username(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          avatar: faker.image.avatar(),
          phoneNumber: faker.phone.number(),
          password: '123',
          role: 'user',
        },
      })
    )
  );

  const allUsers = [admin, ...users];

  const tags = await Promise.all(
    ['JavaScript', 'Web Development', 'Machine Learning', 'Python', 'Dart', 'AI', 'Data Science'].map((tag) =>
      prisma.tag.create({ data: { name: tag } })
    )
  );

  const codeTemplates: { id: number }[] = [];
  
  for (const language of languages) {
    const numTemplates = Math.floor(Math.random() * 10) + 1; // 1 to 10 templates per language
    for (let i = 1; i <= numTemplates; i++) {
      const code = languageCodeSamples[language as keyof typeof languageCodeSamples](i);
      const template = await prisma.codeTemplate.create({
        data: {
          title: `${language} Code Example ${i}`,
          explanation: faker.lorem.sentence(),
          code,
          language,
          createdUserId: allUsers[Math.floor(Math.random() * allUsers.length)].id,
        },
      });
      codeTemplates.push(template);
    }
  }

  const blogPosts = await Promise.all(
    Array.from({ length: 20 }).map((_, i) =>
      prisma.blogPost.create({
        data: {
          title: `Blog Post Title ${i + 1}`,
          description: faker.lorem.sentence(),
          content: faker.lorem.paragraphs(),
          rating: Math.floor(Math.random() * 21) - 10,
          tags: i % 3 === 0
            ? { connect: [tags[i % tags.length], tags[(i + 1) % tags.length]] }
            : undefined,
          codeTemplates: i % 5 === 0
            ? { connect: [{ id: codeTemplates[i % codeTemplates.length].id }] }
            : undefined,
          createdUserId: allUsers[Math.floor(Math.random() * allUsers.length)].id,
        },
      })
    )
  );

  // Adding comments with nested replies
  const comments = [];
  for (const blogPost of blogPosts) {
    const baseComment = await prisma.comment.create({
      data: {
        content: faker.lorem.sentence(),
        createdUserId: allUsers[Math.floor(Math.random() * allUsers.length)].id,
        blogPostId: blogPost.id,
      },
    });
    comments.push(baseComment);

    let parentComment = baseComment;
    for (let layer = 1; layer <= 3; layer++) {
      if (Math.random() < 0.5) {
        const reply = await prisma.comment.create({
          data: {
            content: `Nested reply layer ${layer}`,
            createdUserId: allUsers[layer % allUsers.length].id,
            repliedToId: parentComment.id,
            rating: Math.floor(Math.random() * 21) - 10,
          },
        });
        parentComment = reply;
        comments.push(reply);
      }
    }
  }

  // Adding reports to BlogPosts
  for (const blogPost of blogPosts.slice(0, 10)) { // Report 10 random blog posts
    const numReports = Math.floor(Math.random() * 3) + 1; // 1 to 3 reports per blog post
    for (let i = 0; i < numReports; i++) {
      await prisma.report.create({
        data: {
          reason: faker.lorem.sentence(),
          createdUserId: allUsers[Math.floor(Math.random() * allUsers.length)].id,
          blogPostId: blogPost.id,
        },
      });
    }
  }

  // Adding reports to Comments
  for (const comment of comments.slice(0, 15)) { // Report 15 random comments
    const numReports = Math.floor(Math.random() * 3) + 1; // 1 to 3 reports per comment
    for (let i = 0; i < numReports; i++) {
      await prisma.report.create({
        data: {
          reason: faker.lorem.sentence(),
          createdUserId: allUsers[Math.floor(Math.random() * allUsers.length)].id,
          commentId: comment.id,
        },
      });
    }
  }

  console.log("Data seeding completed!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });