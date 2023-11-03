import { DependencyList, EffectCallback, useEffect, useRef } from "react"

export function useLazyEffect(effect: EffectCallback, deps?: DependencyList) {
    const firstRender = useRef(true)

    useEffect(() => {
        if (!firstRender.current) {
            return effect()
        }
        firstRender.current = false
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps)
}
