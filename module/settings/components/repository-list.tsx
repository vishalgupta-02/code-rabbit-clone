"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getConnectedRepos,
  disconnectRepository,
  disconnectAllRepository,
} from "../actions";
import { toast } from "sonner";
import { ExternalLink, Trash, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export const RepositoryList = () => {
  const queryClient = useQueryClient();

  const [disconnectedAllOpen, setDisconnectedAllOpen] = useState(false);

  const { data: repositories, isLoading } = useQuery({
    queryKey: ["connected-repos"],
    queryFn: async () => await getConnectedRepos(),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });

  const disconnectMutation = useMutation({
    mutationFn: async (repoId: string) => {
      return await disconnectRepository(repoId);
    },
    onSuccess: (result) => {
      if (result?.success) {
        queryClient.invalidateQueries({ queryKey: ["connected-repos"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        toast.success("Repository disconnected successfully");
      } else {
        toast.error(result?.error || "Failed to disconnect repository");
      }
    },
  });

  const disconnectAllMutation = useMutation({
    mutationFn: async () => {
      return await disconnectAllRepository();
    },
    onSuccess: (result) => {
      if (result?.success) {
        queryClient.invalidateQueries({ queryKey: ["connected-repos"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        toast.success(`Disconnected ${result.count} repositories`);
        setDisconnectedAllOpen(false);
      } else {
        toast.error(result?.error || "Failed to disconnect repositories");
      }
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connected Repositories</CardTitle>
          <CardDescription>
            Manage your connected Github repositories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="bg-muted h-20"></div>
            <div className="bg-muted h-20"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Connected Repositories</CardTitle>
            <CardDescription>
              Manage your connected Github repositories
            </CardDescription>
          </div>
          {repositories && repositories.length > 0 && (
            <AlertDialog
              open={disconnectedAllOpen}
              onOpenChange={setDisconnectedAllOpen}
            >
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash className="mr-2 h-4 w-4" />
                  Disconnect All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader className="flex items-center gap-2">
                  <AlertDialogTitle>
                    <AlertTriangle className="text-destructive h-5 w-5" />
                    Disconnect All Repositories?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will disconnect all {repositories.length} repositories
                    and delete all associated AI reviews. This action cannot be
                    undone. Review carefully
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={disconnectAllMutation.isPending}
                    onClick={() => disconnectAllMutation.mutate()}
                  >
                    {disconnectAllMutation.isPending
                      ? "Disconnecting"
                      : "Disconnect all"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {!repositories || repositories.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center">
            <p>No repositories connected yet.</p>
            <p className="mt-2 text-sm">
              Connect repositories from the Repository page.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {repositories.map((repo) => (
              <div
                key={repo.id}
                className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-semibold">{repo.fullName}</h3>
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                  {repo.description && (
                    <p className="text-muted-foreground mt-1 truncate text-sm">
                      {repo.description}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-2">
                    {repo.language && (
                      <Badge variant="secondary" className="text-xs">
                        {repo.language}
                      </Badge>
                    )}
                  </div>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 ml-4"
                      size="sm"
                      variant="ghost"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Disconnect Repository?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This will disconnect <strong>{repo.fullName}</strong>{" "}
                        and delete all associated AI reviews. This action cannot
                        be undone. Review carefully
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => disconnectMutation.mutate(repo.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        disabled={disconnectMutation.isPending}
                      >
                        {disconnectMutation.isPending
                          ? "Disconneting..."
                          : "Disconnect"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
