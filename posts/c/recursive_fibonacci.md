---
title: Recursive Fibonacci
publish_date: 2023-11-20
tags: ["C"]
---

To introduce the most basic features of C, let’s look at code for a simple mathematical function that does calculations on integers. This fnction calculates the nth number in the Febonacci series, in which each number is the sum of the previous two: 1, 1, 2, 3, 5, 8, 13, 21, 34 …

```c
int
fib (int n)
{
    if (n<=2)
        return 1;
    else
        return fib (n - 1) + fib (n - 2);
}
```

The fuction fib calls itself, it calls recursive call, and it’s common. But it’s not useful if have no return. Thus, recursive definitions, to be of any use, must avoid infinite recursion.


