# Common Interview Patterns

| Must do | Two Sum, Anagram, Brackets, Min Stack, Merge Intervals, Pivoted Search, Sliding Window, Queue from Two Stacks |
| --- | --- |
| Very useful | Linked list remove kth, Count Components, Detect Cycle, Top K Frequent, Peak Concurrent Sessions |
| Only if time | LIS, Shortest Path, MST, Scheduler, harder custom ones |

## Binary Search

```go
int left = 0;
int right = values.Length - 1;

while (left <= right)
{
    int mid = left + (right - left) / 2;

    if (values[mid] == target)
    {
        return mid;
    }

    if (values[mid] < target)
    {
        left = mid + 1;
    }
    else
    {
        right = mid - 1;
    }
}

return -1;
```

##