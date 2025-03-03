declare module "next-pwa" {
   import { NextConfig } from "next";
 
   function withPWA(config: NextConfig): NextConfig;
 
   export { withPWA };
   export default withPWA;
 }
 