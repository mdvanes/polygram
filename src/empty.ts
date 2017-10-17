// at least one *.ts file is needed for tsconfig


function greeter(person: string) {
    return `empty.ts: Hello ${person}`;
}
const user: string = 'World';
// tslint:disable-next-line
console.log(greeter(user));
