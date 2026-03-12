import { Search, Pill, Activity, Clock, Users, X } from "lucide-react"
import { useState } from "react"

export default function PendingTasks() {

const tasks = [
{
id:1,
title:"Administer Aspirin",
description:"100mg - Once daily",
patient:"John Smith",
bed:"A-101",
time:"10:00 AM",
priority:"high",
type:"medicine"
},

{
id:2,
title:"Administer Lisinopril",
description:"10mg - Morning dose",
patient:"John Smith",
bed:"A-101",
time:"09:00 AM",
priority:"high",
type:"medicine"
},

{
id:3,
title:"Vital Signs Check",
description:"Temperature, BP, Heart Rate",
patient:"Sarah Johnson",
bed:"B-205",
time:"11:00 AM",
priority:"medium",
type:"checkup"
},

{
id:4,
title:"Post-Surgery Follow-up",
description:"Check wound healing and vitals",
patient:"Michael Chen",
bed:"C-310",
time:"02:00 PM",
priority:"high",
type:"checkup"
},

{
id:5,
title:"Administer Metformin",
description:"500mg - Afternoon dose",
patient:"Robert Lee",
bed:"D-110",
time:"03:00 PM",
priority:"medium",
type:"medicine"
}
]

const [filter,setFilter] = useState("all")

const filteredTasks =
filter === "all"
? tasks
: tasks.filter(task => task.type === filter)

return (

<div className="min-h-screen bg-white flex flex-col">

{/* HEADER */}

<div className="p-4">

<h1 className="text-xl font-semibold">Pending Tasks</h1>

<div className="mt-3 flex items-center bg-gray-100 rounded-lg px-3 py-2">
<Search size={18} className="text-gray-500"/>
<input
placeholder="Search tasks or patients..."
className="bg-transparent outline-none ml-2 text-sm w-full"
/>
</div>

</div>


{/* FILTER BUTTONS */}

<div className="px-4 flex gap-2 text-sm">

<button
onClick={()=>setFilter("all")}
className={`px-3 py-1 rounded-full ${filter==="all"?"bg-black text-white":"bg-gray-100"}`}
>
All Tasks
</button>

<button
onClick={()=>setFilter("medicine")}
className="px-3 py-1 rounded-full bg-gray-100 flex gap-1 items-center"
>
<Pill size={14}/>
Medicine
</button>

<button
onClick={()=>setFilter("checkup")}
className="px-3 py-1 rounded-full bg-gray-100 flex gap-1 items-center"
>
<Activity size={14}/>
Checkups
</button>

<button className="px-3 py-1 rounded-full bg-gray-100">
General
</button>

</div>


{/* TODO TITLE */}

<div className="px-4 mt-4 flex items-center gap-2">
<Clock size={18}/>
<h2 className="font-semibold">To Do ({filteredTasks.length})</h2>
</div>


{/* TASK LIST */}

<div className="px-4 mt-2 flex flex-col gap-3">

{filteredTasks.map(task=>(
<div key={task.id} className="border rounded-xl p-4 flex justify-between">

<div>

<div className="flex items-center gap-2">

<input type="checkbox"/>

{task.type==="medicine"
? <Pill size={18} className="text-blue-500"/>
: <Activity size={18} className="text-green-500"/>}

<h3 className="font-semibold">{task.title}</h3>

<span className={`text-xs px-2 py-0.5 rounded-full 
${task.priority==="high"
? "bg-red-100 text-red-600"
: "bg-yellow-100 text-yellow-600"}`}>
{task.priority}
</span>

</div>

<p className="text-sm text-gray-600 mt-1">{task.description}</p>

<p className="text-sm text-gray-500 mt-1">
{task.patient} &nbsp; Bed: {task.bed}
</p>

</div>


<div className="flex flex-col items-end justify-between">

<button>
<X size={16}/>
</button>

<div className="text-blue-600 text-sm flex items-center gap-1">
<Clock size={14}/>
{task.time}
</div>

</div>

</div>
))}

</div>


{/* BOTTOM NAVBAR */}

<div className="mt-auto border-t flex justify-around py-3 text-sm text-gray-600">

<div className="flex flex-col items-center gap-1 text-blue-600">
<Clock size={18}/>
Pending
</div>

<div className="flex flex-col items-center gap-1">
<Users size={18}/>
Patients
</div>

</div>

</div>

)
}