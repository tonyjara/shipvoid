import { useColorMode } from "@chakra-ui/react";
import sanitizeHtml from "sanitize-html";

const HtmlParser = ({
  content,
  mode,
}: {
  content: string;
  mode?: "light" | "dark";
}) => {
  const { colorMode: sytemMode } = useColorMode();
  const sanitizedContent = sanitizeHtml(content);

  const colorMode = mode ?? sytemMode;

  return (
    <div
      className={
        colorMode === "light"
          ? "prose max-w-none whitespace-normal leading-none  prose-a:text-blue-600 prose-strong:font-extrabold"
          : "prose max-w-none leading-none text-slate-300 prose-headings:text-slate-300 prose-p:text-slate-300 prose-a:text-blue-300 prose-strong:font-extrabold prose-strong:text-blue-700"
      }
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

export default HtmlParser;
