export function generateRandomEmail(): string {
    const timestamp = new Date().getTime();
    return `test${timestamp}@example.com`;
}

export function generateRandomName(): string {
    const timestamp = new Date().getTime();
    return `User${timestamp}`;
}
