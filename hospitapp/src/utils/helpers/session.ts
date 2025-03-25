import jwt from 'jsonwebtoken';


const createSession = (email: string) => {
    
    const SESSION = jwt.sign({ email: email }, process.env.JWT_SECRET as string, {
        expiresIn: '1h',
    });
    console.log("sending session");
    return SESSION;

}

export { createSession };