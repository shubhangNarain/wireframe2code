import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Coins, DollarSign } from "lucide-react";

export function CreditsCard() {
  const credits = [
    {
      cost: "$99.99",
      creditsRecieved: 100000,
      value: "Pro",
      title: "Do you think you're rich enough?",
      description: "Try buying a million of our credits.",
    },
    {
      cost: "$199.99",
      creditsRecieved: 1000000,
      value: "Ultra Pro Max",
      title: "Do you think you're rich enough?",
      description: "Try buying a million of our credits.",
    },
  ];

  return (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        {credits.map((credit,index) => {
          return (
            <TabsTrigger value={credit.value}>{credit.value}</TabsTrigger>
          );
        })}
        {/* <TabsTrigger value="Pro">Pro Max</TabsTrigger>
        <TabsTrigger value="Ultra Pro Max">Ultra Pro Max</TabsTrigger> */}
      </TabsList>
      {credits.map((credit, index) => {
        return (
          <TabsContent value={credit.value}>
            <Card className="flex flex-col items-center justify-center">
              <CardHeader>
                <CardTitle>{credit.title}</CardTitle>
                <CardDescription>{credit.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 max-w-[200px]">
                <div className="flex space-y-1 gap-2"><DollarSign/>Cost of credits: {credit.cost}</div>
                <div className="flex space-y-1 gap-2"><Coins/> Credits Recieved: {credit.creditsRecieved}</div>
              </CardContent>
              <CardFooter>
                <Button>Buy</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        );
      })}
    </Tabs>
  );

  {
    /* <TabsContent value="Ultra Pro Max">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password here. After saving, you'll be logged out.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save password</Button>
          </CardFooter>
        </Card>
        </TabsContent> */
  }
  // );
}

export default CreditsCard;
