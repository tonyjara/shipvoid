import {
    Box,
    Divider,
    Flex,
    Heading,
    IconButton,
    Text,
    Tooltip,
} from "@chakra-ui/react"
import React, { useEffect } from "react"
import { BiCollapseVertical } from "react-icons/bi"
import { FiHelpCircle } from "react-icons/fi"

const CollapsableContainer = ({
    children,
    title,
    style,
    titleComponents,
    subTitle,
    tooltipText,
    startCollapsed,
    collapseAll,
    setCollapseAll,
}: {
    children: React.ReactNode
    title: string
    style?: React.CSSProperties
    titleComponents?: React.ReactNode | React.ReactNode[]
    subTitle?: string
    tooltipText?: string
    startCollapsed?: boolean
    collapseAll?: boolean
    setCollapseAll?: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const [show, setShow] = React.useState(startCollapsed ? false : true)

    const handleToggle = () => {
        setShow(!show)
        if (collapseAll && setCollapseAll) setCollapseAll(false)
    }
    useEffect(() => {
        if (!collapseAll || !show || !setCollapseAll) return
        setShow(false)
        setCollapseAll(false)
        return () => {}
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [collapseAll, show])

    return (
        <Flex direction={"column"} gap={"5px"} style={style} w={"100%"}>
            <Flex
                /* py={"10px"} */
                justifyContent={"space-between"}
                alignItems={"center"}
                gap={5}
                w={"100%"}
            >
                <Flex gap={"10px"} alignItems={"center"}>
                    <IconButton
                        variant={show ? "solid" : "outline"}
                        size={"sm"}
                        aria-label="Minimize container"
                        fontSize={"sm"}
                        icon={<BiCollapseVertical />}
                        onClick={handleToggle}
                    />
                    <Heading whiteSpace="nowrap" fontSize={"xl"}>
                        {title}
                    </Heading>
                    {tooltipText && (
                        <Tooltip label={tooltipText}>
                            <IconButton
                                variant={"ghost"}
                                size={"sm"}
                                aria-label="help popover"
                            >
                                <FiHelpCircle />
                            </IconButton>
                        </Tooltip>
                    )}
                </Flex>
                {titleComponents}
            </Flex>
            {subTitle && show && <Text color={"gray.500"}>{subTitle}</Text>}

            {/* <Collapse unmountOnExit in={show}> It's breaking zindex */}
            <Box display={show ? "block" : "none"}>{children}</Box>
            {/* </Collapse> */}
            {!show && <Divider />}
        </Flex>
    )
}

export default CollapsableContainer
