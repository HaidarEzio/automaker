import { useCallback } from 'react';
import type { NavigateOptions } from '@tanstack/react-router';
import { cn } from '@/lib/utils';
import { formatShortcut } from '@/store/app-store';
import { Activity, Settings, User, Bug, BookOpen, ExternalLink } from 'lucide-react';
import { useOSDetection } from '@/hooks/use-os-detection';
import { getElectronAPI } from '@/lib/electron';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

function getOSAbbreviation(os: string): string {
  switch (os) {
    case 'mac':
      return 'M';
    case 'windows':
      return 'W';
    case 'linux':
      return 'L';
    default:
      return '?';
  }
}

interface SidebarFooterProps {
  sidebarOpen: boolean;
  isActiveRoute: (id: string) => boolean;
  navigate: (opts: NavigateOptions) => void;
  hideRunningAgents: boolean;
  hideWiki: boolean;
  runningAgentsCount: number;
  shortcuts: {
    settings: string;
  };
}

export function SidebarFooter({
  sidebarOpen,
  isActiveRoute,
  navigate,
  hideRunningAgents,
  hideWiki,
  runningAgentsCount,
  shortcuts,
}: SidebarFooterProps) {
  const appVersion = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '0.0.0';
  const { os } = useOSDetection();
  const appMode = import.meta.env.VITE_APP_MODE || '?';
  const versionSuffix = `${getOSAbbreviation(os)}${appMode}`;

  const handleWikiClick = useCallback(() => {
    navigate({ to: '/wiki' });
  }, [navigate]);

  const handleBugReportClick = useCallback(() => {
    const api = getElectronAPI();
    api.openExternalLink('https://github.com/AutoMaker-Org/automaker/issues');
  }, []);

  // Collapsed state
  if (!sidebarOpen) {
    return (
      <div
        className={cn(
          'shrink-0 border-t border-border/40',
          'bg-gradient-to-t from-background/10 via-sidebar/50 to-transparent'
        )}
      >
        <div className="flex flex-col items-center py-2 px-2 gap-1">
          {/* Running Agents */}
          {!hideRunningAgents && (
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => navigate({ to: '/running-agents' })}
                    className={cn(
                      'relative flex items-center justify-center w-10 h-10 rounded-xl',
                      'transition-all duration-200 ease-out titlebar-no-drag',
                      isActiveRoute('running-agents')
                        ? [
                            'bg-gradient-to-r from-brand-500/20 via-brand-500/15 to-brand-600/10',
                            'text-foreground border border-brand-500/30',
                            'shadow-md shadow-brand-500/10',
                          ]
                        : [
                            'text-muted-foreground hover:text-foreground',
                            'hover:bg-accent/50 border border-transparent hover:border-border/40',
                          ]
                    )}
                    data-testid="running-agents-link"
                  >
                    <Activity
                      className={cn(
                        'w-[18px] h-[18px]',
                        isActiveRoute('running-agents') && 'text-brand-500'
                      )}
                    />
                    {runningAgentsCount > 0 && (
                      <span
                        className={cn(
                          'absolute -top-1 -right-1 flex items-center justify-center',
                          'min-w-4 h-4 px-1 text-[9px] font-bold rounded-full',
                          'bg-brand-500 text-white shadow-sm'
                        )}
                      >
                        {runningAgentsCount > 99 ? '99' : runningAgentsCount}
                      </span>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}>
                  Running Agents
                  {runningAgentsCount > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 bg-brand-500 text-white rounded-full text-[10px]">
                      {runningAgentsCount}
                    </span>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* Settings */}
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => navigate({ to: '/settings' })}
                  className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-xl',
                    'transition-all duration-200 ease-out titlebar-no-drag',
                    isActiveRoute('settings')
                      ? [
                          'bg-gradient-to-r from-brand-500/20 via-brand-500/15 to-brand-600/10',
                          'text-foreground border border-brand-500/30',
                          'shadow-md shadow-brand-500/10',
                        ]
                      : [
                          'text-muted-foreground hover:text-foreground',
                          'hover:bg-accent/50 border border-transparent hover:border-border/40',
                        ]
                  )}
                  data-testid="settings-button"
                >
                  <Settings
                    className={cn(
                      'w-[18px] h-[18px]',
                      isActiveRoute('settings') && 'text-brand-500'
                    )}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8}>
                Global Settings
                <span className="ml-2 px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono text-muted-foreground">
                  {formatShortcut(shortcuts.settings, true)}
                </span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* User Dropdown */}
          <DropdownMenu>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        'flex items-center justify-center w-10 h-10 rounded-xl',
                        'text-muted-foreground hover:text-foreground',
                        'hover:bg-accent/50 border border-transparent hover:border-border/40',
                        'transition-all duration-200 ease-out titlebar-no-drag'
                      )}
                      data-testid="user-dropdown-trigger"
                    >
                      <User className="w-[18px] h-[18px]" />
                    </button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}>
                  More options
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent side="right" align="end" sideOffset={8} className="w-48">
              {!hideWiki && (
                <DropdownMenuItem onClick={handleWikiClick} className="cursor-pointer">
                  <BookOpen className="w-4 h-4 mr-2" />
                  <span>Documentation</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={handleBugReportClick} className="cursor-pointer">
                <Bug className="w-4 h-4 mr-2" />
                <span>Report Bug</span>
                <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5">
                <span className="text-[10px] text-muted-foreground">
                  v{appVersion} {versionSuffix}
                </span>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }

  // Expanded state
  return (
    <div
      className={cn(
        'shrink-0 border-t border-border/40',
        'bg-gradient-to-t from-background/10 via-sidebar/50 to-transparent'
      )}
    >
      {/* Running Agents Link */}
      {!hideRunningAgents && (
        <div className="p-2 pb-0">
          <button
            onClick={() => navigate({ to: '/running-agents' })}
            className={cn(
              'group flex items-center w-full px-3 py-2.5 rounded-xl relative overflow-hidden titlebar-no-drag',
              'transition-all duration-200 ease-out',
              isActiveRoute('running-agents')
                ? [
                    'bg-gradient-to-r from-brand-500/20 via-brand-500/15 to-brand-600/10',
                    'text-foreground font-medium',
                    'border border-brand-500/30',
                    'shadow-md shadow-brand-500/10',
                  ]
                : [
                    'text-muted-foreground hover:text-foreground',
                    'hover:bg-accent/50',
                    'border border-transparent hover:border-border/40',
                    'hover:shadow-sm',
                  ],
              'hover:scale-[1.02] active:scale-[0.97]'
            )}
            data-testid="running-agents-link"
          >
            <div className="relative">
              <Activity
                className={cn(
                  'w-[18px] h-[18px] shrink-0 transition-all duration-200',
                  isActiveRoute('running-agents')
                    ? 'text-brand-500 drop-shadow-sm'
                    : 'group-hover:text-brand-400 group-hover:scale-110'
                )}
              />
            </div>
            <span className="ml-3 font-medium text-sm flex-1 text-left">Running Agents</span>
            {runningAgentsCount > 0 && (
              <span
                className={cn(
                  'flex items-center justify-center',
                  'min-w-6 h-6 px-1.5 text-xs font-semibold rounded-full',
                  'bg-brand-500 text-white shadow-sm',
                  isActiveRoute('running-agents') && 'bg-brand-600'
                )}
                data-testid="running-agents-count"
              >
                {runningAgentsCount > 99 ? '99' : runningAgentsCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Settings Link */}
      <div className="p-2 pb-0">
        <button
          onClick={() => navigate({ to: '/settings' })}
          className={cn(
            'group flex items-center w-full px-3 py-2.5 rounded-xl relative overflow-hidden titlebar-no-drag',
            'transition-all duration-200 ease-out',
            isActiveRoute('settings')
              ? [
                  'bg-gradient-to-r from-brand-500/20 via-brand-500/15 to-brand-600/10',
                  'text-foreground font-medium',
                  'border border-brand-500/30',
                  'shadow-md shadow-brand-500/10',
                ]
              : [
                  'text-muted-foreground hover:text-foreground',
                  'hover:bg-accent/50',
                  'border border-transparent hover:border-border/40',
                  'hover:shadow-sm',
                ],
            'hover:scale-[1.02] active:scale-[0.97]'
          )}
          data-testid="settings-button"
        >
          <Settings
            className={cn(
              'w-[18px] h-[18px] shrink-0 transition-all duration-200',
              isActiveRoute('settings')
                ? 'text-brand-500 drop-shadow-sm'
                : 'group-hover:text-brand-400 group-hover:rotate-90 group-hover:scale-110'
            )}
          />
          <span className="ml-3 font-medium text-sm flex-1 text-left">Global Settings</span>
          <span
            className={cn(
              'flex items-center justify-center min-w-5 h-5 px-1.5 text-[10px] font-mono rounded-md transition-all duration-200',
              isActiveRoute('settings')
                ? 'bg-brand-500/20 text-brand-400'
                : 'bg-muted text-muted-foreground group-hover:bg-accent'
            )}
            data-testid="shortcut-settings"
          >
            {formatShortcut(shortcuts.settings, true)}
          </span>
        </button>
      </div>

      {/* User area with dropdown */}
      <div className="p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                'group flex items-center w-full px-3 py-2.5 rounded-xl titlebar-no-drag',
                'text-muted-foreground hover:text-foreground',
                'hover:bg-accent/50 border border-transparent hover:border-border/40',
                'transition-all duration-200 ease-out',
                'hover:scale-[1.02] active:scale-[0.97]'
              )}
              data-testid="user-dropdown-trigger"
            >
              <div className="w-7 h-7 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                <User className="w-4 h-4 text-brand-500" />
              </div>
              <div className="ml-3 flex flex-col items-start flex-1 min-w-0">
                <span className="text-sm font-medium text-foreground">User</span>
                <span className="text-[10px] text-muted-foreground">
                  v{appVersion} {versionSuffix}
                </span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top" sideOffset={8} className="w-56">
            {!hideWiki && (
              <DropdownMenuItem onClick={handleWikiClick} className="cursor-pointer">
                <BookOpen className="w-4 h-4 mr-2" />
                <span>Documentation</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={handleBugReportClick} className="cursor-pointer">
              <Bug className="w-4 h-4 mr-2" />
              <span>Report Bug / Feature Request</span>
              <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
