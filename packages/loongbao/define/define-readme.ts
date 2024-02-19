export const defineReadme = (readme: string): (() => string) => {
  return () => readme;
};
