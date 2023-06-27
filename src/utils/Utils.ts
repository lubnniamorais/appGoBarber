function noImage(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURI(name)}&lenght=2`;
}

export { noImage };
