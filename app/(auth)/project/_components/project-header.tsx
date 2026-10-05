import { Button } from '@/components/ui/button';
import AddProject from './add-project';
import { Project } from '@/types/project-types';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { useCallback } from 'react';

interface ProjectHeaderProps {
    title: string;
    buttonTitle: string;
    selectedProject: Project | null;
    setSelectedProject: (project:Project | null) => void;
    isOpen: boolean
    setIsOpen: (open: boolean) => void,
    search: string,
    setSearch: (search: string) => void,
    count: { PLANNED: number; RUNNING: number; COMPLETED: number }
}

const ProjectHeader = ({ title, buttonTitle, selectedProject, setSelectedProject, isOpen, setIsOpen, count, search, setSearch }: ProjectHeaderProps) => {

    const handleOpen = useCallback(() => {
        setIsOpen(true);
    },[setIsOpen]);

  return (
    <div className="flex items-center justify-between mt-2 border rounded-md p-2 bg-card">
        <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">{title}</h1>
            <Separator orientation="vertical" />
            <div>
                <div className="flex space-x-2">
                    <div className="border border-green-500 text-gray-200 px-3 py-1 rounded-xs text-sm font-medium">
                        Planned: {count.PLANNED}
                    </div>
                    <div className="border border-yellow-500 text-gray-200 px-3 py-1 rounded-xs text-sm font-medium">
                        Running: {count.RUNNING}
                    </div>
                    <div className="border border-blue-500 text-gray-200 px-3 py-1 rounded-xs text-sm font-medium">
                        Completed: {count.COMPLETED}
                    </div>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <Input 
                type="search" 
                placeholder="Project Name..."
                value={search}
                onChange={(event)=>setSearch(event.target.value)}
                autoFocus={true}
                className="px-3 py-1 rounded-xs border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Button className="bg-blue-500 text-white hover:bg-blue-600 cursor-pointer rounded-xs" onClick={handleOpen}>
                {buttonTitle}
            </Button>
        </div>
        <AddProject modelOpen={isOpen} modelClose={() => setIsOpen(false)} selectedProject={selectedProject} setSelectedProject={setSelectedProject} />
    </div>
  )
}

export default ProjectHeader;
