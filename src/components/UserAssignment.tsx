import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { profileApi, todoApi } from '@/services/api';
import type { Profile } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface UserAssignmentProps {
  todoId: string;
  assignedUsers: Array<{
    id: string;
    username: string;
    avatar_url?: string;
  }>;
  onAssignmentChange: () => void;
}

export function UserAssignment({ todoId, assignedUsers, onAssignmentChange }: UserAssignmentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const searchUsers = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        setLoading(true);
        const results = await profileApi.searchUsers(searchQuery);
        // Filter out already assigned users and current user
        setSearchResults(results.filter(r => 
          !assignedUsers.some(au => au.id === r.id) && 
          r.id !== user?.id
        ));
      } catch (error) {
        console.error('Error searching users:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, assignedUsers, user?.id]);

  const handleAssign = async (userId: string) => {
    try {
      await todoApi.assign(todoId, userId);
      onAssignmentChange();
      toast({
        title: "User assigned",
        description: "The user has been assigned to this task.",
      });
    } catch (error) {
      console.error('Error assigning user:', error);
      toast({
        title: "Error",
        description: "Failed to assign user to task.",
        variant: "destructive",
      });
    }
  };

  const handleUnassign = async (userId: string) => {
    try {
      await todoApi.unassign(todoId, userId);
      onAssignmentChange();
      toast({
        title: "User unassigned",
        description: "The user has been unassigned from this task.",
      });
    } catch (error) {
      console.error('Error unassigning user:', error);
      toast({
        title: "Error",
        description: "Failed to unassign user from task.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <Users className="h-4 w-4" />
          <span>{assignedUsers.length} assigned</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Users</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Assigned Users</h4>
            {assignedUsers.length === 0 ? (
              <p className="text-sm text-gray-500">No users assigned</p>
            ) : (
              <div className="space-y-2">
                {assignedUsers.map(user => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.username}
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                          {user.username[0].toUpperCase()}
                        </div>
                      )}
                      <span>{user.username}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUnassign(user.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {searchResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Search Results</h4>
              <div className="space-y-2">
                {searchResults.map(user => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.username}
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                          {user.username[0].toUpperCase()}
                        </div>
                      )}
                      <span>{user.username}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAssign(user.id)}
                    >
                      Assign
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {loading && (
            <div className="text-center text-sm text-gray-500">
              Searching...
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 