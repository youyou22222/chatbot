import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css'; // 选择一个您喜欢的主题

const MyMarkdownComponent = ({ markdownContent }) => {
  // 当组件更新时应用代码高亮
  useEffect(() => {
    Prism.highlightAll();
  });

  return (
    <div className="message-content">
      <ReactMarkdown remarkPlugins={[gfm]} children={markdownContent} />
    </div>
  );
};

export default MyMarkdownComponent;
