import { useState } from 'react';
import MessageList from './MessageList';
import ProjectList from './ProjectList';
import ProjectForm from './ProjectForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function Dashboard() {
  const [showProjectForm, setShowProjectForm] = useState(false);
  
  return (
    <div className="mt-20 container mx-auto px-6 py-8 flex-grow">
      <div className="bg-darker rounded-xl border border-slate-800 shadow-xl overflow-hidden">
        <Tabs defaultValue="messages">
          <div className="bg-dark border-b border-slate-800 px-6 py-2 flex items-center justify-between">
            <TabsList className="bg-transparent">
              <TabsTrigger 
                value="messages" 
                className="data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-primary text-slate-400 px-6 py-4"
              >
                Messages
              </TabsTrigger>
              <TabsTrigger 
                value="projects" 
                className="data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-primary text-slate-400 px-6 py-4"
              >
                Projects
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="projects" className="mt-0">
              <Button 
                onClick={() => setShowProjectForm(!showProjectForm)} 
                className="bg-primary hover:bg-primary/90 text-white rounded-lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                {showProjectForm ? 'Hide Form' : 'Add New Project'}
              </Button>
            </TabsContent>
          </div>

          <TabsContent value="messages" className="p-6">
            <MessageList />
          </TabsContent>
          
          <TabsContent value="projects" className="p-6">
            {showProjectForm && (
              <div className="mb-6 p-6 bg-dark rounded-lg border border-slate-800">
                <h3 className="text-xl font-bold mb-4 text-white">Add New Project</h3>
                <ProjectForm onComplete={() => setShowProjectForm(false)} />
              </div>
            )}
            <ProjectList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
