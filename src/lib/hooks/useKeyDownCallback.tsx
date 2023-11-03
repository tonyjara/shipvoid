import { useEffect } from "react"

// Define a custom hook for keyboard events
function useKeyDownCallback(
    targetKey: KeyboardEvent["key"],
    callback: () => void
) {
    // State to track whether the target key is pressed

    // Event handler for keydown
    const downHandler = (event: KeyboardEvent) => {
        if (event.key === targetKey) {
            // Prevent the default action, e.g. scrolling with spacebar
            event.preventDefault()
            callback()
        }
    }

    // Event handler for keyup

    // Add event listeners when the component mounts
    useEffect(() => {
        // Attach the event listeners to the document
        document.addEventListener("keydown", downHandler)

        // Clean up the event listeners when the component unmounts
        return () => {
            document.removeEventListener("keydown", downHandler)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return
}

export default useKeyDownCallback
