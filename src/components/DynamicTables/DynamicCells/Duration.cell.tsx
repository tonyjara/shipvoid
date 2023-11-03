import React from "react"
import { Text } from "@chakra-ui/react"
import { formatSecondsToDuration } from "@/lib/utils/durationUtils"

interface props {
    value: number | undefined
}

const DurationCell = ({ value }: props) => {
    return (
        <Text fontSize="sm" fontWeight="bold">
            {value ? formatSecondsToDuration(value) : "-"}
        </Text>
    )
}

export default DurationCell
