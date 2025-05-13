import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Message } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Filter, Eye, Trash2 } from 'lucide-react';

export default function MessageList() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [filter, setFilter] = useState<string>("All Messages");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<number | null>(null);
  
  const { data: messages, isLoading, error } = useQuery<Message[]>({
    queryKey: ['/api/messages'],
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest('PUT', `/api/messages/${id}/read`, null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
    }
  });

  const deleteMessageMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest('DELETE', `/api/messages/${id}`, null);
    },
    onSuccess: () => {
      toast({
        title: "Message deleted",
        description: "The message has been permanently removed",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
      setMessageToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete message: " + error.message,
        variant: "destructive",
        duration: 5000,
      });
    }
  });
  
  const filteredMessages = messages?.filter(message => {
    if (filter === "All Messages") return true;
    if (filter === "With Project Interest") return !!message.projectInterest;
    if (filter === "General Inquiries") return !message.projectInterest;
    return true;
  });
  
  const viewMessage = (message: Message) => {
    setSelectedMessage(message);
    if (!message.read) {
      markAsReadMutation.mutate(message.id);
    }
  };
  
  const confirmDelete = (id: number) => {
    setMessageToDelete(id);
  };
  
  const deleteMessage = () => {
    if (messageToDelete) {
      deleteMessageMutation.mutate(messageToDelete);
    }
  };
  
  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Incoming Messages</h2>
          <div className="flex items-center">
            <Skeleton className="h-10 w-40 mr-3" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-dark p-4 rounded-lg">
              <Skeleton className="h-6 w-1/4 mb-2" />
              <Skeleton className="h-4 w-1/3 mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <p>Failed to load messages. Please try again later.</p>
        <p className="text-sm mt-2">{String(error)}</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Incoming Messages</h2>
        <div className="flex items-center">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-dark border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:ring-2 focus:ring-primary focus:border-primary mr-3"
          >
            <option>All Messages</option>
            <option>With Project Interest</option>
            <option>General Inquiries</option>
          </select>
          <Button variant="outline" size="icon" className="bg-dark hover:bg-slate-800 text-white border border-slate-700">
            <Filter className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {filteredMessages?.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          <p>No messages found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800">
            <thead className="bg-dark">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Project Interest</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-darker divide-y divide-slate-800">
              {filteredMessages?.map((message) => (
                <tr key={message.id} className={!message.read ? "bg-primary/5" : ""}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{message.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-300">{message.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {message.projectInterest ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-secondary/20 text-secondary">
                        {message.projectInterest}
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-700 text-slate-300">
                        None
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {format(new Date(message.createdAt), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button 
                      variant="ghost" 
                      className="text-primary hover:text-primary/80 mr-3"
                      onClick={() => viewMessage(message)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="text-accent hover:text-accent/80"
                      onClick={() => confirmDelete(message.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Message View Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="bg-darker border border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Message from {selectedMessage?.name}</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="mb-4">
              <p className="text-sm text-slate-400">From:</p>
              <p className="text-white">{selectedMessage?.name} &lt;{selectedMessage?.email}&gt;</p>
            </div>
            
            {selectedMessage?.projectInterest && (
              <div className="mb-4">
                <p className="text-sm text-slate-400">Project Interest:</p>
                <p className="text-secondary">{selectedMessage.projectInterest}</p>
              </div>
            )}
            
            <div className="mb-4">
              <p className="text-sm text-slate-400">Date:</p>
              <p className="text-white">
                {selectedMessage?.createdAt 
                  ? format(new Date(selectedMessage.createdAt), 'PPpp') 
                  : ''}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-slate-400 mb-2">Message:</p>
              <div className="bg-dark p-4 rounded-lg text-white whitespace-pre-wrap">
                {selectedMessage?.message}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setSelectedMessage(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={!!messageToDelete} onOpenChange={() => setMessageToDelete(null)}>
        <DialogContent className="bg-darker border border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Confirm Deletion</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-white">Are you sure you want to delete this message? This action cannot be undone.</p>
          </div>
          
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setMessageToDelete(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={deleteMessage} 
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
