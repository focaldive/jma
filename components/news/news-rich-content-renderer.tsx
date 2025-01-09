import React from "react";
import Image from "next/image";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";

interface RichContentRendererProps {
  content: string;
}

export function RichContentRenderer({ content }: RichContentRendererProps) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");

  const renderElement = (element: Element): React.ReactNode => {
    switch (element.tagName.toLowerCase()) {
      case "img":
        return (
          <div className="my-6">
            <Image
              src={element.getAttribute("src") || ""}
              alt={element.getAttribute("alt") || ""}
              width={717}
              height={1024}
              layout="responsive"
              className="rounded-lg"
            />
          </div>
        );
      case "h1":
      case "h2":
      case "h3":
      case "h4":
      case "h5":
      case "h6":
        const HeadingTag = element.tagName.toLowerCase();
        return React.createElement(
          HeadingTag,
          { className: "font-bold mt-6 mb-4" },
          element.textContent
        );
      case "p":
        return <p className="mb-4 leading-relaxed">{element.textContent}</p>;
      case "ul":
        return (
          <ul className="list-disc list-inside mb-4 space-y-2">
            {Array.from(element.children).map((li, index) => (
              <li key={index}>{li.textContent}</li>
            ))}
          </ul>
        );
      case "ol":
        return (
          <ol className="list-decimal list-inside mb-4 space-y-2">
            {Array.from(element.children).map((li, index) => (
              <li key={index}>{li.textContent}</li>
            ))}
          </ol>
        );
      case "blockquote":
        return (
          <blockquote className="border-l-4 border-primary pl-4 italic my-4">
            {element.textContent}
          </blockquote>
        );
      case "a":
        return (
          <a
            href={element.getAttribute("href") || "#"}
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {element.textContent}
          </a>
        );
      case "strong":
      case "b":
        return <strong className="font-semibold">{element.textContent}</strong>;
      case "em":
      case "i":
        return <em className="italic">{element.textContent}</em>;
      case "br":
        return <br />;
      default:
        if (element.children && element.children.length > 0) {
          return (
            <>
              {Array.from(element.children).map((child, index) => (
                <React.Fragment key={index}>
                  {renderElement(child)}
                </React.Fragment>
              ))}
            </>
          );
        }
        return element.textContent;
    }
  };

  const contentElements = Array.from(doc.body.children);

  return (
    <div className="rich-content-renderer">
      {contentElements.map((element, index) => (
        <React.Fragment key={index}>{renderElement(element)}</React.Fragment>
      ))}
    </div>
  );
}
