import React from "react";
import { Card, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";
import { Tabs, TabsList, TabsTrigger } from "./ui/Tabs";
import { Input } from "./ui/Input";
import { Textarea } from "./ui/Textarea";
import { UploadCloud, CheckCircle, Percent, Trophy } from "lucide-react";

export function ChefDashboard() {
  return (
    <main className="min-h-screen px-4 py-6 bg-white">
      <h1 className="text-xl font-bold mb-4">👨‍🍳 Chef Control Panel</h1>
      <Tabs defaultValue="menu">
        <TabsList className="grid grid-cols-3 gap-1 mb-4">
          <TabsTrigger value="menu">My Dishes</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="stats">Earnings</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="mb-4">
        <CardContent className="space-y-3 p-4">
          <h2 className="font-semibold">Add New Dish</h2>
          <Input placeholder="Dish Name" />
          <Textarea placeholder="Short description of your dish..." />
          <Input type="file" className="border-dashed border-2" />
          <Input type="number" placeholder="Price (CAD)" />
          <Button>
            <UploadCloud className="w-4 h-4 mr-2" /> Publish Dish
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h2 className="font-semibold mb-2">🏆 This Month’s Stats</h2>
          <ul className="text-sm space-y-1">
            <li>
              <CheckCircle className="inline w-4 h-4 mr-1 text-green-600" /> Orders Fulfilled: 82
            </li>
            <li>
              <Percent className="inline w-4 h-4 mr-1 text-yellow-500" /> Commission Rate: 25%
            </li>
            <li>
              <Trophy className="inline w-4 h-4 mr-1 text-orange-500" /> Leaderboard Rank: #2 in Kitchener
            </li>
          </ul>
        </CardContent>
      </Card>
    </main>
  );
}
