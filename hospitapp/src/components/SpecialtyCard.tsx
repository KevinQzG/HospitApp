interface Props {
   name: string;
   active?: boolean;
 }
 
 export default function SpecialtyCard({ name, active = false }: Props) {
   return (
     <div className={`p-6 rounded-xl shadow-md ${active ? "bg-blue-500 text-white" : "bg-white"}`}>
       <h4 className="text-lg font-bold">{name}</h4>
     </div>
   );
 }
 