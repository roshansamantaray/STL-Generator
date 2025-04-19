// #src\components\messages\message-markdown.tsx
import React, { FC } from "react";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { MessageCodeBlock } from "./message-codeblock";
import { MessageMarkdownMemoized } from "./message-markdown-memoized";
import { Bar, Line, Pie, Doughnut, Radar, PolarArea, Bubble, Scatter } from 'react-chartjs-2';

import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement, 
  ArcElement, 
  Title, 
  Tooltip, 
  Legend, 
  RadialLinearScale 
} from "chart.js";

// Register necessary Chart.js components
ChartJS.register(
  CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, RadialLinearScale, 
  Title, Tooltip, Legend
);

interface MessageMarkdownProps {
  content: string;
}

const chartMap: Record<string, any> = {
  'chart-bar': Bar,
  'chart-line': Line,
  'chart-pie': Pie,
  'chart-doughnut': Doughnut,
  'chart-radar': Radar,
  'chart-polar': PolarArea,
  'chart-bubble': Bubble,
  'chart-scatter': Scatter
};

const renderChart = (chartType: string, chartData: any) => {
  const ChartComponent = chartMap[chartType];
  if (!ChartComponent) {
    return <pre>Unsupported chart type: {chartType}</pre>;
  }

  // Chart options can be extended as needed.
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      title: { display: true, text: chartType },
    },
  };

  return <ChartComponent data={chartData} options={options} />;
};

export const MessageMarkdown: FC<MessageMarkdownProps> = ({ content }) => {
  return (
    <MessageMarkdownMemoized
      className="prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 min-w-full space-y-6 break-words"
      remarkPlugins={[remarkGfm, remarkMath]}
      components={{
        p({ children }) {
          return <p className="mb-2 last:mb-0">{children}</p>;
        },
        img({ node, ...props }) {
          return <img className="max-w-[67%]" {...props} />;
        },
        
        
        code({ node, className, children, ...props }) {
          const childArray = React.Children.toArray(children)
          const firstChild = childArray[0] as React.ReactElement
          const firstChildAsString = React.isValidElement(firstChild)
            ? (firstChild as React.ReactElement).props.children
            : firstChild

          if (firstChildAsString === "▍") {
            return <span className="mt-1 animate-pulse cursor-default">▍</span>
          }

          if (typeof firstChildAsString === "string") {
            childArray[0] = firstChildAsString.replace("`▍`", "▍")
          }

          const match = /language-(\w+)/.exec(className || "")

          if (
            typeof firstChildAsString === "string" &&
            !firstChildAsString.includes("\n")
          ) {
            return (
              <code className={className} {...props}>
                {childArray}
              </code>
            )
          }

          const chartTypeMatch = className?.match(/chart-(\w+)/);
          if (chartTypeMatch) {
            const chartType = chartTypeMatch[0];
            try {
              const chartData = JSON.parse(String(children));
              return renderChart(chartType, chartData);
            } catch (e) {
              return <pre>Error parsing chart data</pre>;
            }
          }

          return (
            <MessageCodeBlock
              key={Math.random()}
              language={(match && match[1]) || ""}
              value={String(childArray).replace(/\n$/, "")}
              {...props}
            />
          )
        }
      }}
    >
      {content}
    </MessageMarkdownMemoized>
  );
};
