'use client'

import { useState, useEffect, lazy, useRef } from 'react'
import Dots from '@/app/ui/backgrounds/dots'
import Memoji from '@/app/ui/title-section/memoji'
import { VanishingWords } from '@/app/ui/title-section/vanishing-words'
import ScrollPrompt from '@/app/ui/title-section/scroll-prompt'

export default function Home() {
    const mainRef = useRef(null)

    const descriptiveWords = [
        'Software Engineer',
        'Swimmer',
        'Software Architect',
    ]
    const relativeClause = 'Aspiring'

    useEffect(() => {
        document.documentElement.classList.add('dark')
    }, [])

    return (
        <main
            className="h-screen w-screen snap-mandatory overflow-scroll hide-scrollbar"
            ref={mainRef}
        >
            <Dots>
                <section className="h-screen w-screen flex flex-col items-center mt-[10vh]">
                    <h1 className="header1">Ben Lewis-Jones</h1>
                    <Memoji className="w-52 sm:w-64 md:w-72 lg:w-96" />
                    <VanishingWords
                        className="secondary text-2xl sm:text-4xl"
                        relativeClause={relativeClause}
                        words={descriptiveWords}
                    />
                    <ScrollPrompt
                        className={`mt-auto mb-52`}
                        textSize={`text-base`}
                        displayDelayMs={2500}
                        mainRef={mainRef}
                    />
                </section>
                <section className="h-screen w-screen snap-start">
                    <p className="header1">hello world</p>
                </section>
            </Dots>
        </main>
    )
}

/*
'use client'

import { AnimatePresence, motion, LayoutGroup } from 'framer-motion';
import React, { useCallback, useEffect, useRef, useState } from "react";
import { cn } from '../../lib/utils'
import { clsx } from 'clsx'

export const VanishingWords = ({
  words,
  duration = 3000,
  relativeClause,
  className,
}: {
  words: string[]
  duration?: number
  className?: string
}) => {
  const divRef = useRef(null)
  const prevDiv = useRef(null)
  const currDiv = useRef(null)

  const [currentWord, setCurrentWord] = useState(words[0])
  const [isAnimating, setIsAnimating] = useState<boolean>(false)

  const [prevWord, setPrevWord] = useState(words[0])
  const [currWord, setCurrWord] = useState(words[1])

  const [prevWordSize, setPrevWordSize] = useState(0)
  const [currWordSize, setCurrWordSize] = useState(0)
  const [xOffSet, setXOffSet] = useState(0)

  const startAnimation = useCallback(() => {
      setPrevWord(words[(words.indexOf(prevWord) + 1) % words.length])
      setCurrWord(words[(words.indexOf(currWord) + 1) % words.length])

      const word = words[words.indexOf(currentWord) + 1] || words[0]
      setCurrentWord(word)

      setIsAnimating(true)
  }, [currentWord, prevWord, currWord, words])

  useEffect(() => {
      if (prevDiv.current && currDiv.current) {
          setPrevWordSize(prevDiv.current.offsetWidth)
          setCurrWordSize(currDiv.current.offsetWidth)
          setXOffSet(currWordSize / 2 - prevWordSize / 2)
      }
  }, [prevWord, currWord])

  useEffect(() => {
      if (!isAnimating) {
          const timeout = setTimeout(() => {
              startAnimation()
          }, duration)
          return () => clearTimeout(timeout)
      }
  }, [isAnimating, startAnimation, duration])

  return (
      <div
          className={`${className} relative w-full flex items-center justify-center`}
      >
          <AnimatePresence
              onExitComplete={() => {
                  console.log('exit')
                  setIsAnimating(false)
              }}
          >
              <motion.div
                  key={`${currentWord}-${xOffSet}`}
                  ref={divRef}
                  transition={{ duration: 1 }}
                  initial={{ x: xOffSet }}
                  animate={{ x: 0 }}
              >
                <span className="flex items-center">
                    {relativeClause}
                </span>
                  <motion.div
                      key={currentWord}
                      className={cn(
                          'z-10 inline-block relative text-left text-neutral-900 dark:text-neutral-100 px-2',
                          className
                      )}
                  >
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
                              className={clsx(
                                  'inline-block',
                                  letter === ' ' && 'w-1'
                              )}
                          >
                              {letter}
                          </motion.span>
                      ))}
                  </motion.div>
              </motion.div>
          </AnimatePresence>

<div
    style={{
        position: 'absolute',
        left: '-10000px',
    }}
>
    <div
        style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        }}
    >
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
            }}
            ref={prevDiv}
        >
            <div>{prevWord}</div>
        </div>
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
            }}
            ref={currDiv}
        >
            <div>{currWord}</div>
        </div>
    </div>
</div>
</div>
)
}
**/

/**
 * 'use client'
 *
 * import { AnimatePresence, motion, LayoutGroup } from 'framer-motion';
 * import React, { useCallback, useEffect, useRef, useState } from "react";
 *
 *
 * export default function Test() {
 *   const words = ['123', '123456', '123456789']
 *
 *   const divRef = useRef(null);
 *   const prevDiv= useRef(null);
 *   const currDiv = useRef(null);
 *
 *   const [currentWord, setCurrentWord] = useState(words[0]);
 *   const [isAnimating, setIsAnimating] = useState<boolean>(false);
 *
 *   const [prevWord, setPrevWord] = useState(words[words.length - 1]);
 *   const [currWord, setCurrWord] = useState(words[0]);
 *
 *   const [prevWordSize, setPrevWordSize] = useState(0);
 *   const [currWordSize, setCurrWordSize] = useState(0);
 *   const [xOffSet, setXOffSet] = useState(0);
 *
 *   const startAnimation = useCallback(() => {
 *
 *     // 1. Set the current word to the previous word
 *     setPrevWord(words[(words.indexOf(prevWord) + 1) % words.length])
 *     setCurrWord(words[(words.indexOf(currWord) + 1) % words.length])
 *
 *     // 4. Change displayed word
 *     const word = words[words.indexOf(currentWord) + 1] || words[0];
 *     setCurrentWord(word);
 *
 *     // 5. Start animation
 *     setIsAnimating(true);
 *   }, [currentWord, prevWord, currWord, words])
 *
 *   useEffect(() => {
 *     // 2. Update sizes
 *     if (prevDiv.current && currDiv.current) {
 *       setPrevWordSize(prevDiv.current.offsetWidth);
 *       setCurrWordSize(currDiv.current.offsetWidth);
 *
 *       // 3. update their position
 *       setXOffSet((prevWordSize / 2) - (currWordSize / 2));
 *     }
 *   }, [prevWord, currWord]);
 *
 *   useEffect(() => {
 *     console.log(`offSet: ${xOffSet} | ${prevWordSize} -> ${currWordSize}`);
 *   }, [xOffSet])
 *
 *   useEffect(() => {
 *     if (!isAnimating) {
 *       // replay animation after 2 seconds
 *       setTimeout(() => {
 *         startAnimation()
 *       }, 5000)
 *     }
 *   }, [isAnimating, startAnimation])
 *
 *   return (
 *     <div className={{ position: 'relative', width: '100%' }}>
 *       <AnimatePresence
 *           onExitComplete={() => {
 *             console.log('')
 *             setIsAnimating(false)
 *           }}
 *       >
 *       <motion.div
 *         key={`${currentWord}-${xOffSet}`}
 *         style={{
 *           display: 'flex',
 *           alignItems: 'center',
 *           justifyContent: 'center'
 *         }}
 *         ref={divRef}
 *         transition={{ duration: 5 }}
 *         initial={{ x: xOffSet }}
 *         animate={{ x: 0 }}
 *         exit={{ }}
 *         >
 *           <p>hello</p>
 *           <motion.div
 *             key={currentWord}
 *             transition={{
 *               duration: 1
 *             }}
 *             initial={{ }}
 *             animate={{ }}
 *             exit={{ }}
 *             >
 *             {currentWord}
 *           </motion.div>
 *         </motion.div>
 *       </AnimatePresence>
 *
 *       <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
 *         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}  ref={prevDiv}>
 *           <p>hello</p>
 *           <div>{prevWord}</div>
 *         </div>
 *         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}  ref={currDiv}>
 *           <p>hello</p>
 *           <div>{currWord}</div>
 *         </div>
 *       </div>
 *
 *       <div style={{
 *         position: 'absolute',
 *         top: 0,
 *         bottom: 0,
 *         left: '50%',
 *         width: '1px',
 *         backgroundColor: 'black'
 *       }}></div>
 *     </div>
 *   )
 * }
 */

// last moving version

// "use client";
//
// import { AnimatePresence, motion, LayoutGroup } from "framer-motion";
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { cn } from "../../lib/utils";
// import { clsx } from "clsx";
//
// export const VanishingWords = ({
//                                    words,
//                                    duration = 3000,
//                                    relativeClause,
//                                    className,
//                                }: {
//     words: string[];
//     duration?: number;
//     className?: string;
// }) => {
//     const divRef = useRef(null);
//     const prevDiv = useRef(null);
//     const currDiv = useRef(null);
//
//     const [currentWord, setCurrentWord] = useState(words[0]);
//     const [isAnimating, setIsAnimating] = useState<boolean>(false);
//
//     const [prevWord, setPrevWord] = useState(words[0]);
//     const [currWord, setCurrWord] = useState(words[1]);
//
//     const [prevWordSize, setPrevWordSize] = useState(0);
//     const [currWordSize, setCurrWordSize] = useState(0);
//     const [xOffSet, setXOffSet] = useState(0);
//
//     const startAnimation = useCallback(() => {
//         setPrevWord(words[(words.indexOf(prevWord) + 1) % words.length]);
//         setCurrWord(words[(words.indexOf(currWord) + 1) % words.length]);
//
//         const word = words[words.indexOf(currentWord) + 1] || words[0];
//         setCurrentWord(word);
//
//         setIsAnimating(true);
//     }, [currentWord, prevWord, currWord, words]);
//
//     useEffect(() => {
//         if (prevDiv.current && currDiv.current) {
//             setPrevWordSize(prevDiv.current.offsetWidth);
//             setCurrWordSize(currDiv.current.offsetWidth);
//             setXOffSet(currWordSize / 2 - prevWordSize / 2);
//         }
//     }, [prevWord, currWord]);
//
//     useEffect(() => {
//         if (!isAnimating) {
//             const timeout = setTimeout(() => {
//                 startAnimation();
//             }, duration);
//             return () => clearTimeout(timeout);
//         }
//     }, [isAnimating, startAnimation, duration]);
//
//     return (
//         <div
//             className={{ position: 'relative', width: '100%' }}
//         >
//             <AnimatePresence
//                 onExitComplete={() => {
//                     console.log("exit");
//                     setIsAnimating(false);
//                 }}
//             >
//                 <motion.div
//                     key={`${currentWord}-${xOffSet}`}
//                     style={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center'
//                     }}
//                     ref={divRef}
//                     transition={{ duration: 1 }}
//                     initial={{ x: xOffSet }}
//                     animate={{ x: 0 }}
//                 >
//                     <p>{relativeClause}</p>
//                     <motion.div
//                         key={currentWord}
//                         className={cn(
//                             "z-10 inline-block relative text-left text-neutral-900 dark:text-neutral-100 px-2",
//                             className,
//                         )}
//                     >
//                         {currentWord.split("").map((letter, index) => (
//                             <motion.span
//                                 key={currentWord + index}
//                                 initial={{
//                                     opacity: 0,
//                                     y: 10,
//                                     filter: "blur(8px)",
//                                 }}
//                                 animate={{
//                                     opacity: 1,
//                                     y: 0,
//                                     filter: "blur(0px)",
//                                 }}
//                                 transition={{
//                                     delay: index * 0.08,
//                                     duration: 0.3,
//                                 }}
//                                 className={clsx("inline-block", letter === " " && "w-1")}
//                             >
//                                 {letter}
//                             </motion.span>
//                         ))}
//                     </motion.div>
//                 </motion.div>
//             </AnimatePresence>
//
//             {/* Used to get the size of the next item */}
//             <div
//                 style={{
//                     position: "absolute",
//                     left: "-10000px",
//                 }}
//             >
//                 <div
//                     style={{
//                         display: "flex",
//                         flexDirection: "column",
//                         alignItems: "center",
//                         justifyContent: "center",
//                     }}
//                 >
//                     <div
//                         style={{
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             flexShrink: 0,
//                         }}
//                         ref={prevDiv}
//                     >
//                         <div>{prevWord}</div>
//                     </div>
//                     <div
//                         style={{
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             flexShrink: 0,
//                         }}
//                         ref={currDiv}
//                     >
//                         <div>{currWord}</div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// bug seems to have disappeared

// "use client";
//
// import { AnimatePresence, motion, LayoutGroup } from "framer-motion";
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { cn } from "../../lib/utils";
// import { clsx } from "clsx";
//
// export const VanishingWords = ({
//                                    words,
//                                    duration = 3000,
//                                    relativeClause,
//                                    className,
//                                }: {
//     words: string[];
//     duration?: number;
//     className?: string;
// }) => {
//     const divRef = useRef(null);
//     const prevDiv = useRef(null);
//     const currDiv = useRef(null);
//
//     const [currentWord, setCurrentWord] = useState(words[0]);
//     const [isAnimating, setIsAnimating] = useState<boolean>(false);
//
//     const [prevWord, setPrevWord] = useState(words[0]);
//     const [currWord, setCurrWord] = useState(words[1]);
//
//     const [prevWordSize, setPrevWordSize] = useState(0);
//     const [currWordSize, setCurrWordSize] = useState(0);
//     const [xOffSet, setXOffSet] = useState(0);
//
//     const startAnimation = useCallback(() => {
//         // 2a. Here divs that are far away from the screen are
//         // used to calculate how wide the words are (when displayed).
//         // I have done this here because this must be calcualted
//         // before the next word is rendered.
//         setPrevWord(words[(words.indexOf(prevWord) + 1) % words.length]);
//         setCurrWord(words[(words.indexOf(currWord) + 1) % words.length]);
//         // This will trigger the useEffect below at (2b)
//
//         // 3. The word displayed to the use is selected
//         setCurrentWord(words[(words.indexOf(currentWord) + 1) % words.length]);
//
//         //
//         setIsAnimating(true);
//     }, [currentWord, prevWord, currWord, words]);
//
//     useEffect(() => {
//         if (prevDiv.current && currDiv.current) {
//             setPrevWordSize(prevDiv.current.offsetWidth);
//             setCurrWordSize(currDiv.current.offsetWidth);
//             setXOffSet(currWordSize / 2 - prevWordSize / 2);
//         }
//     }, [prevWord, currWord]);
//
//     useEffect(() => {
//         // 1. When page starts, is animating is false
//         // Take note of this since this is essentually the start of the main loop
//         if (!isAnimating) {
//             const timeout = setTimeout(() => {
//                 startAnimation();
//             }, duration);
//             return () => clearTimeout(timeout);
//         }
//     }, [isAnimating, startAnimation, duration]);
//
//     return (
//         <div
//             className={{ position: 'relative', width: '100%' }}
//         >
//             <AnimatePresence
//                 onExitComplete={() => {
//                     console.log("exit");
//                     setIsAnimating(false);
//                 }}
//             >
//                 <motion.div
//                     key={`${currentWord}-${xOffSet}`}
//                     style={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center'
//                     }}
//                     ref={divRef}
//                     transition={{ duration: 1 }}
//                     initial={{ x: xOffSet }}
//                     animate={{ x: 0 }}
//                 >
//                     <p>{relativeClause}</p>
//                     <motion.div
//                         key={currentWord}
//                     >
//                         {currentWord.split("").map((letter, index) => (
//                             <motion.span
//                                 key={currentWord + index}
//                                 initial={{
//                                     opacity: 0,
//                                     y: 10,
//                                     filter: "blur(8px)",
//                                 }}
//                                 animate={{
//                                     opacity: 1,
//                                     y: 0,
//                                     filter: "blur(0px)",
//                                 }}
//                                 transition={{
//                                     delay: index * 0.08,
//                                     duration: 0.3,
//                                 }}
//                                 className={clsx("inline-block", letter === " " && "w-1")}
//                             >
//                                 {letter}
//                             </motion.span>
//                         ))}
//                     </motion.div>
//                 </motion.div>
//             </AnimatePresence>
//
//             {/* Used to get the size of the next item */}
//             <div
//                 style={{
//                     position: "absolute",
//                     left: "-10000px",
//                 }}
//             >
//                 <div
//                     style={{
//                         display: "flex",
//                         flexDirection: "column",
//                         alignItems: "center",
//                         justifyContent: "center",
//                     }}
//                 >
//                     <div
//                         style={{
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             flexShrink: 0,
//                         }}
//                         ref={prevDiv}
//                     >
//                         <div>{prevWord}</div>
//                     </div>
//                     <div
//                         style={{
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             flexShrink: 0,
//                         }}
//                         ref={currDiv}
//                     >
//                         <div>{currWord}</div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export const VanishingWords = ({
//                                    words,
//                                    duration = 3000,
//                                    relativeClause,
//                                    className,
//                                }: {
//     words: string[]
//     duration?: number
//     relativeClause: string
//     className?: string
// }) => {
//     const divRef = useRef(null)
//     const prevDiv = useRef(null)
//     const currDiv = useRef(null)
//
//     const [currentWord, setCurrentWord] = useState(words[0])
//     const [isAnimating, setIsAnimating] = useState<boolean>(false)
//
//     const [prevWord, setPrevWord] = useState(words[0])
//     const [currWord, setCurrWord] = useState(words[1])
//
//     const [prevWordSize, setPrevWordSize] = useState(0)
//     const [currWordSize, setCurrWordSize] = useState(0)
//     const [xOffSet, setXOffSet] = useState(0)
//
//     const startAnimation = useCallback(() => {
//         // 2a. Here divs that are far away from the screen are
//         // used to calculate how wide the words are (when displayed).
//         // This code must run before setPrevWord this here because
//         // this must be calcualted before the next word is rendered.
//         setPrevWord(words[(words.indexOf(prevWord) + 1) % words.length])
//         setCurrWord(words[(words.indexOf(currWord) + 1) % words.length])
//         // This will trigger the useEffect below at (2b)
//
//         // 3. The word displayed to the use is selected
//         const word = words[words.indexOf(currentWord) + 1] || words[0]
//         setCurrentWord(word)
//
//         // 4. The animation starts.
//         setIsAnimating(true)
//     }, [currentWord, prevWord, currWord, words])
//
//     useEffect(() => {
//         // 2b. This code calculates the offset that is needed
//         // to place the relativeClause, directly below
//         // relativeClause from the previous word. Making sure
//         // the animation is smooth.
//         if (prevDiv.current && currDiv.current) {
//             setPrevWordSize(prevDiv.current.offsetWidth)
//             setCurrWordSize(currDiv.current.offsetWidth)
//             setXOffSet(currWordSize / 2 - prevWordSize / 2)
//         }
//     }, [currWord])
//
//     useEffect(() => {
//         // 1. When page starts, is animating is false.
//         // Take note of this since this is essentually the
//         // start of the main loop.
//         if (!isAnimating) {
//             const timeout = setTimeout(() => {
//                 startAnimation()
//             }, duration)
//             return () => clearTimeout(timeout)
//         }
//     }, [isAnimating])
//
//     return (
//         <div
//             className={`${className} relative w-full flex items-center justify-center`}
//         >
//             <AnimatePresence
//                 onExitComplete={() => {
//                     // 5. The animation is reset.
//                     setIsAnimating(false)
//                 }}
//             >
//                 <motion.div
//                     key={`${currentWord}`}
//                     ref={divRef}
//                     transition={{ duration: 1 }}
//                     initial={{ x: xOffSet }}
//                     animate={{ x: 0 }}
//                 >
//                     <p className="inline-block">{relativeClause}</p>
//
//                     <motion.div
//                         className="z-10 inline-block relative text-left text-neutral-900 dark:text-neutral-100 px-2" >
//                         {/* b1: Swapping out the div above with the one below seems to make it worse */}
//                         {/* <motion.div
//                         className="z-10 inline-block relative text-left text-neutral-900 dark:text-neutral-100 px-2"
//                         initial={{
//                             opacity: 0,
//                             y: 10,
//                         }}
//                         animate={{
//                             opacity: 1,
//                             y: 0,
//                         }}
//                         transition={{
//                             duration: 0.4,
//                             ease: 'easeInOut',
//                             type: 'spring',
//                             stiffness: 100,
//                             damping: 10,
//                         }}
//                         exit={{
//                             opacity: 0,
//                             y: -40,
//                             x: 40,
//                             filter: 'blur(8px)',
//                             scale: 2,
//                             position: 'absolute',
//                         }}
//                     > */}
//                         {currentWord.split('').map((letter, index) => (
//                             <motion.span
//                                 key={currentWord + index}
//                                 initial={{
//                                     opacity: 0,
//                                     y: 10,
//                                     filter: 'blur(8px)',
//                                 }}
//                                 animate={{
//                                     opacity: 1,
//                                     y: 0,
//                                     filter: 'blur(0px)',
//                                 }}
//                                 transition={{
//                                     delay: index * 0.08,
//                                     duration: 0.3,
//                                 }}
//                                 className={clsx(
//                                     'inline-block',
//                                     letter === ' ' && 'w-1'
//                                 )}
//                             >
//                                 {letter}
//                             </motion.span>
//                         ))}
//                     </motion.div>
//                 </motion.div>
//             </AnimatePresence>
//
//             <div
//                 style={{
//                     position: 'absolute',
//                     left: '-10000px',
//                 }}
//             >
//                 <div
//                     style={{
//                         display: 'flex',
//                         flexDirection: 'column',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                     }}
//                 >
//                     <div
//                         style={{
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             flexShrink: 0,
//                         }}
//                         ref={prevDiv}
//                     >
//                         <div>{prevWord}</div>
//                     </div>
//                     <div
//                         style={{
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             flexShrink: 0,
//                         }}
//                         ref={currDiv}
//                     >
//                         <div>{currWord}</div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }
