# threads.js

Trying out Nodejs new worker_threads.

No dependencies just run it

```
      $ node threads.js
```

Output seen on my 2015 Macbook Pro 2.8 GHz quad core I7 with Hyperthreading

```
      $ node threads.js
      Continue?
```
Do a `pgrep node` to grab the pid

```
      $ top -pid <pid>

      PID   COMMAND     %CPU TIME     #TH  #WQ  #POR MEM   PURG CMPR PGRP PPID  STATE    BOOSTS    %CPU_ME
      5041  node        0.0  00:00.05 7    0    29   7848K 0B   0B   5041 86884 sleeping *0[1]     0.00000

```

Now any key to `Continue?` and observe the `%CPU` and `#TH`. And note how the time decreases as we add threads, until it doesn't.

Note that my MBP quad with Hyperthreading gives me 8 virtual cores. But the # of threads yields worse performance after 4.

```
      $ node threads.js
      Continue?

      numThreads 1 time = 15922
      numThreads 2 time = 8114
      numThreads 3 time = 6266
      numThreads 4 time = 5406
      numThreads 5 time = 5539
      numThreads 6 time = 5502
      numThreads 7 time = 5627
      numThreads 8 time = 5603
      numThreads 9 time = 5628
```

```
      PID   COMMAND      %CPU TIME     #TH
      5041  node         97.0 00:07.93 8/1
```

```
      ID   COMMAND      %CPU  TIME     #TH
      5041  node         196.2 00:19.69 9/2
```

```
      PID   COMMAND      %CPU  TIME     #TH
      5041  node         281.3 00:45.94 10/3
```
