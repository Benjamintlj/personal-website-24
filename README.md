[//]: # '# Personal Website'
[//]: #
[//]: # 'My personal website to show who i am.'

# What am I trying to do & context?

I am currently making a personal website, and I wanted center this container. You can an example on [Aceternity](https://ui.aceternity.com/components/flip-words).
With a modified version this container centered, the container would jump.

As a result I have created the code found on [Replit](https://replit.com/@BenLewisJones/test-2) (it is commented with further details). This code works by
calculating the width of the current and previous div, and then initialing the div's `x` value to make up for the offset.

# What is the problem I am facing?

At random intervals the animation seems to bug out and create two instances of itself. As show in the images below.
I have attempted to localise the problem, with no success. The glitch seems to last for around a single frame. I truly
have no clue and have been stuck on this for a while.

# Theories

1. It is possible that multiple nested motions, could be somehow effecting one another - I have tested to see if
   `onExitComplete` is being called multiple times, and it does not seem like it.
2. Uncommenting `b1` does seem to make it worse

# Code that is likely causing the problem

```tsx
<AnimatePresence
    onExitComplete={() => {
        // 5. The animation loops
        setIsAnimating(false)
    }}
>
    <motion.div
        key={`${currentWord}-${xOffSet}`}
        style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}
        ref={divRef}
        transition={{ duration: 1 }}
        initial={{ x: xOffSet }}
        animate={{ x: 0 }}
    >
        <p>{relativeClause}</p>

        <motion.div key={currentWord}>
            {/* b1: Swapping out the div above with the one below seems to make it worse */}
            {/* <motion.div
            key={currentWord}
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.4,
              ease: "easeInOut",
              type: "spring",
              stiffness: 100,
              damping: 10,
            }}
            exit={{
              opacity: 0,
              y: -40,
              x: 40,
              filter: "blur(8px)",
              scale: 2,
              position: "absolute",
            }}
          > */}

            {currentWord.split('').map((letter, index) => (
                <motion.span
                    key={currentWord + index}
                    initial={{
                        opacity: 0,
                        y: 10,
                        filter: 'blur(8px)',
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        filter: 'blur(0px)',
                    }}
                    transition={{
                        delay: index * 0.08,
                        duration: 0.3,
                    }}
                    className={clsx('inline-block', letter === ' ' && 'w-1')}
                >
                    {letter}
                </motion.span>
            ))}
        </motion.div>
    </motion.div>
</AnimatePresence>
```
