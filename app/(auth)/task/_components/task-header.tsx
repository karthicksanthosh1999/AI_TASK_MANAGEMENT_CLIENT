import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { useCallback } from 'react';
import { Task } from '@/types/task-types';
import AddTask from './add-task';

interface TaskHeaderProps {
    title: string;
    buttonTitle?: string;
    selectedTask: Task | null;
    setSelectedTask: (task:Task | null) => void;
    isOpen: boolean
    setIsOpen: (open: boolean) => void,
    search: string,
    setSearch: (search: string) => void,
    count?: { PLANNED: number; IN_PROGRESS: number; COMPLETED: number }
}

const TaskHeader = ({ title, buttonTitle, selectedTask, setSelectedTask, isOpen, setIsOpen, count, search, setSearch }: TaskHeaderProps) => {

    const handleOpen = useCallback(() => {
        setIsOpen(true);
    },[setIsOpen]);

  return (
    <div className="flex items-center justify-between mt-2 border rounded-md p-2 bg-card">
            <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold">{title ?? "N/A"}</h1>
                { count &&  <Separator orientation="vertical" /> }
                {
                count && (
                <div>
                    <div className="flex space-x-2">
                        <div className="border border-green-500 text-gray-200 px-3 py-1 rounded-xs text-sm font-medium">
                            Planned: {count.PLANNED ?? 0}
                        </div>
                        <div className="border border-yellow-500 text-gray-200 px-3 py-1 rounded-xs text-sm font-medium">
                            PROGRESS: {count.IN_PROGRESS ?? 0}
                        </div>
                        <div className="border border-blue-500 text-gray-200 px-3 py-1 rounded-xs text-sm font-medium">
                            Completed: {count.COMPLETED ?? 0}
                        </div>
                    </div>
                </div>
                    )
                }
            </div>
        <div className="flex items-center gap-2">
            <Input 
                type="search" 
                placeholder="Task Name..."
                value={search}
                onChange={(event)=>setSearch(event.target.value)}
                autoFocus={true}
                className="px-3 py-1 rounded-xs border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {
                buttonTitle && 
                <Button className="bg-blue-500 text-white hover:bg-blue-600 cursor-pointer rounded-xs" onClick={handleOpen}>
                    {buttonTitle}
                </Button>
            }
        </div>
        <AddTask modelOpen={isOpen} modelClose={() => setIsOpen(false)} selectedTask={selectedTask} setSelectedTask={setSelectedTask} />
    </div>
  )
}

export default TaskHeader;
