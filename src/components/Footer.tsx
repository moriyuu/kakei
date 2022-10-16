import * as Icons from "./icons";

export const Footer = () => {
  return (
    <footer
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text-sub)",
        gap: "5px",
        marginTop: "40px",
        fontSize: "14px",
      }}
    >
      <span>(c) 2022 moriyuu</span>
      <span>･</span>
      <a href="https://github.com/moriyuu/kakei">
        <Icons.Github size={20} />
      </a>
    </footer>
  );
};
