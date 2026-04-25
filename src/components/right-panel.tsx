"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

import { ConversionControls } from "@/components/conversion-controls";
import { AppearanceControls } from "@/components/appearance-controls";
import { ExportControls } from "@/components/export-controls";

export function RightPanel() {
  return (
    <Tabs defaultValue="conversion" className="flex h-full flex-col gap-3">
      <TabsList className="w-full">
        <TabsTrigger value="conversion">Conversion</TabsTrigger>
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
        <TabsTrigger value="export">Export</TabsTrigger>
      </TabsList>
      <ScrollArea className="flex-1 -mr-2 pr-2">
        <TabsContent value="conversion" className="m-0">
          <ConversionControls />
        </TabsContent>
        <TabsContent value="appearance" className="m-0">
          <AppearanceControls />
        </TabsContent>
        <TabsContent value="export" className="m-0">
          <ExportControls />
        </TabsContent>
      </ScrollArea>
    </Tabs>
  );
}
