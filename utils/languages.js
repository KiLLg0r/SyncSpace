import { listAll } from "firebase/storage";

const useLanguages = () => {
  const getLanguage = (extensions) => {
    const languages = {
      bat: "bat",
      c: "c",
      cpp: "cpp",
      cs: "csharp",
      css: "css",
      dockerfile: "dockerfile",
      m: "objective-c",
      h: "objective-c",
      mm: "objective-cpp",
      go: "go",
      html: "html",
      java: "java",
      js: "javascript",
      jsx: "javascriptreact",
      json: "json",
      kt: "kotlin",
      md: "markdown",
      perl: "perl",
      php: "php",
      py: "python",
      rb: "ruby",
      rs: "rust",
      scss: "scss",
      sql: "sql",
      vue: "vue",
      sh: "shellscript",
      swift: "swift",
      ts: "typescript",
      tsx: "typescriptreact",
      xml: "xml",
      yaml: "yaml",
    };
    return languages[extensions] || "plaintext";
  };

  const getUsedLanguages = async (ref) => {
    let usedLanguages = {};

    const desiredExtensions = [
      "bat",
      "c",
      "cpp",
      "cs",
      "css",
      "dockerfile",
      "m",
      "h",
      "mm",
      "go",
      "html",
      "java",
      "js",
      "jsx",
      "json",
      "kt",
      "md",
      "perl",
      "php",
      "py",
      "rb",
      "rs",
      "scss",
      "sql",
      "vue",
      "sh",
      "swift",
      "ts",
      "tsx",
      "xml",
      "yaml",
    ];

    const recursiveIterate = async (ref) => {
      try {
        const res = await listAll(ref);
        await Promise.all(res.prefixes.map((folderRef) => recursiveIterate(folderRef)));
        res.items.forEach((itemRef) => {
          if (itemRef.name !== "‎" && desiredExtensions.some((accepted) => itemRef.name.includes(`.${accepted}`))) {
            const extension = itemRef.name.split(".").pop();
            if (extension in usedLanguages) usedLanguages[extension]++;
            else usedLanguages[extension] = 1;
          }
        });
      } catch (error) {
        console.log(error);
      }
    };

    await recursiveIterate(ref);

    return usedLanguages;
  };

  const getLanguageColor = (extension) => {
    const langColors = {
      bat: { name: "Batch file", color: "#C1F12E" },
      c: { name: "C", color: "#555555" },
      cpp: { name: "C++", color: "#F34B7D" },
      cs: { name: "C#", color: "#178600" },
      css: { name: "CSS", color: "#563D7C" },
      dockerfile: { name: "Dockerfile", color: "#384d54" },
      m: { name: "Objective-C", color: "#438eff" },
      h: { name: "Objective-C", color: "#438eff" },
      mm: { name: "Objective-C++", color: "#438eff" },
      go: { name: "Go", color: "#00ADD8" },
      html: { name: "HTML", color: "#e34c26" },
      java: { name: "Java", color: "#B07219" },
      js: { name: "JavaScript", color: "#F0DB4F" },
      jsx: { name: "JavaScript React", color: "#F0DB4F" },
      json: { name: "JSON", color: "#c7c7c7" },
      kt: { name: "Kotlin", color: "#F18E33" },
      md: { name: "Markdown", color: "#083fa1" },
      perl: { name: "Perl", color: "#0298c3" },
      php: { name: "PHP", color: "#4F5D95" },
      py: { name: "Python", color: "#3572A5" },
      rb: { name: "Ruby", color: "#701516" },
      rs: { name: "Rust", color: "#dea584" },
      scss: { name: "SCSS", color: "#c6538c" },
      sql: { name: "SQL", color: "#e38c00" },
      vue: { name: "Vue", color: "#41B883" },
      sh: { name: "Shell script", color: "#89e051" },
      swift: { name: "Swift", color: "#F05138" },
      ts: { name: "TypeScript", color: "#007ACC" },
      tsx: { name: "TypeScript React", color: "#007ACC" },
      xml: { name: "XML", color: "#f0c800" },
      yaml: { name: "YAML", color: "#a8a8a8" },
    };

    return langColors[extension] || { name: "Unknown", color: "#000000" };
  };

  return { getLanguage, getUsedLanguages, getLanguageColor };
};

export default useLanguages;
