"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Trash, Clipboard } from "lucide-react";
import { toast } from "sonner";

const isValidDomain = (domain) => {
  return /^[a-zA-Z0-9-]+\.(com|xyz|app)$/.test(domain.toLowerCase());
};

const isDomainAvailable = async (domain) => {
  return Math.random() > 0.5;
};

const Challenge = ({ numDomainsRequired = 3 }) => {
  const [cart, setCart] = useState([]);
  const [input, setInput] = useState("");

  const addDomain = async () => {
    const domain = input.trim().toLowerCase();
    if (!isValidDomain(domain)) {
      toast.error("Invalid domain");
      return;
    }
    if (cart.some((item) => item.name === domain)) return;

    const available = await isDomainAvailable(domain);
    setCart([...cart, { name: domain, available }]);
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addDomain();
    }
  };

  const removeDomain = (domain) => {
    setCart(cart.filter((item) => item.name !== domain));
  };

  const clearCart = () => setCart([]);
  const removeUnavailable = () =>
    setCart(cart.filter((item) => item.available));
  const copyToClipboard = () => {
    navigator.clipboard.writeText(cart.map((d) => d.name).join(", "));
    toast.success("Copied to clipboard");
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="max-w-md mx-auto p-4 ">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter domain"
          />
          <Button onClick={addDomain} variant={"secondary"}>
            Add
          </Button>
        </div>
        <div className="mt-4 space-y-2">
          {cart.map(({ name, available }) => (
            <Card
              key={name}
              className="flex justify-between p-2 border rounded"
            >
              <span className={available ? "text-green-500" : "text-red-500"}>
                {name} ({available ? "Available" : "Taken"})
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeDomain(name)}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </Card>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <Button onClick={clearCart} variant="outline">
            Clear
          </Button>
          <Button onClick={removeUnavailable} variant="outline">
            Remove Unavailable
          </Button>
          <Button onClick={copyToClipboard} variant="outline">
            <Clipboard className="w-4 h-4" /> Copy
          </Button>
        </div>
        <Button
          className="w-full mt-4"
          disabled={cart.length !== numDomainsRequired}
        >
          Purchase ({cart.length}/{numDomainsRequired})
        </Button>
      </div>
    </div>
  );
};

export default Challenge;
