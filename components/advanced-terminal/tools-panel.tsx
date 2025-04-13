"use client"

import type React from "react"
import { useState } from "react"
import { X, Play, Search, Shield, Wifi, Database, Terminal, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface ToolsPanelProps {
  onExecute: (command: string) => void
  onClose: () => void
}

interface Tool {
  id: string
  name: string
  description: string
  command: string
  category: "recon" | "exploit" | "post" | "utility"
  icon: React.ReactNode
}

export function ToolsPanel({ onExecute, onClose }: ToolsPanelProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Predefined penetration testing tools
  const tools: Tool[] = [
    // Reconnaissance tools
    {
      id: "nmap",
      name: "Nmap",
      description: "Network discovery and security auditing",
      command: "nmap -sV -sC -oA scan",
      category: "recon",
      icon: <Search className="h-4 w-4" />,
    },
    {
      id: "gobuster",
      name: "Gobuster",
      description: "Directory/file & DNS busting tool",
      command: "gobuster dir -u http://target -w /usr/share/wordlists/dirb/common.txt",
      category: "recon",
      icon: <Search className="h-4 w-4" />,
    },
    {
      id: "wpscan",
      name: "WPScan",
      description: "WordPress vulnerability scanner",
      command: "wpscan --url http://target --enumerate u",
      category: "recon",
      icon: <Search className="h-4 w-4" />,
    },

    // Exploitation tools
    {
      id: "metasploit",
      name: "Metasploit",
      description: "Penetration testing framework",
      command: "msfconsole",
      category: "exploit",
      icon: <Shield className="h-4 w-4" />,
    },
    {
      id: "sqlmap",
      name: "SQLMap",
      description: "Automatic SQL injection tool",
      command: 'sqlmap -u "http://target/page.php?id=1" --dbs',
      category: "exploit",
      icon: <Database className="h-4 w-4" />,
    },
    {
      id: "hydra",
      name: "Hydra",
      description: "Password cracking tool",
      command: "hydra -l admin -P /usr/share/wordlists/rockyou.txt ssh://target",
      category: "exploit",
      icon: <Shield className="h-4 w-4" />,
    },

    // Post-exploitation tools
    {
      id: "linpeas",
      name: "LinPEAS",
      description: "Linux Privilege Escalation Awesome Script",
      command: "./linpeas.sh",
      category: "post",
      icon: <Terminal className="h-4 w-4" />,
    },
    {
      id: "mimikatz",
      name: "Mimikatz",
      description: "Windows credential dumping",
      command: 'mimikatz.exe "privilege::debug" "sekurlsa::logonpasswords" exit',
      category: "post",
      icon: <Terminal className="h-4 w-4" />,
    },

    // Utility tools
    {
      id: "netcat",
      name: "Netcat",
      description: "Networking utility for reading/writing across networks",
      command: "nc -lvnp 4444",
      category: "utility",
      icon: <Wifi className="h-4 w-4" />,
    },
    {
      id: "wireshark",
      name: "Wireshark",
      description: "Network protocol analyzer",
      command: "wireshark",
      category: "utility",
      icon: <Wifi className="h-4 w-4" />,
    },
    {
      id: "hashcat",
      name: "Hashcat",
      description: "Advanced password recovery",
      command: "hashcat -m 0 -a 0 hash.txt /usr/share/wordlists/rockyou.txt",
      category: "utility",
      icon: <Code className="h-4 w-4" />,
    },
    {
      id: "john",
      name: "John the Ripper",
      description: "Password cracking tool",
      command: "john --wordlist=/usr/share/wordlists/rockyou.txt hash.txt",
      category: "utility",
      icon: <Code className="h-4 w-4" />,
    },
  ]

  // Filter tools based on search term
  const filteredTools = tools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.command.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Group tools by category
  const reconTools = filteredTools.filter((tool) => tool.category === "recon")
  const exploitTools = filteredTools.filter((tool) => tool.category === "exploit")
  const postTools = filteredTools.filter((tool) => tool.category === "post")
  const utilityTools = filteredTools.filter((tool) => tool.category === "utility")

  return (
    <div className="w-72 border-r border-neutral-800 bg-neutral-900 flex flex-col">
      <div className="flex items-center justify-between p-2 border-b border-neutral-800">
        <h3 className="text-sm font-medium">Penetration Testing Tools</h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-neutral-400 hover:text-neutral-100"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-2 border-b border-neutral-800">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tools..."
            className="w-full bg-neutral-950 border border-neutral-800 rounded pl-8 pr-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full grid grid-cols-5 h-8 bg-neutral-950 p-0.5">
            <TabsTrigger value="all" className="text-xs h-7">
              All
            </TabsTrigger>
            <TabsTrigger value="recon" className="text-xs h-7">
              Recon
            </TabsTrigger>
            <TabsTrigger value="exploit" className="text-xs h-7">
              Exploit
            </TabsTrigger>
            <TabsTrigger value="post" className="text-xs h-7">
              Post
            </TabsTrigger>
            <TabsTrigger value="utility" className="text-xs h-7">
              Utility
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="p-0 mt-0">
            <Accordion type="multiple" className="w-full">
              {filteredTools.length > 0 ? (
                filteredTools.map((tool) => (
                  <AccordionItem key={tool.id} value={tool.id} className="border-b border-neutral-800">
                    <AccordionTrigger className="py-2 px-3 text-xs hover:bg-neutral-800 hover:no-underline">
                      <div className="flex items-center">
                        {tool.icon}
                        <span className="ml-2">{tool.name}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-3 py-2 bg-neutral-950">
                      <div className="text-xs text-neutral-400 mb-2">{tool.description}</div>
                      <div className="flex items-center justify-between">
                        <code className="text-xs bg-neutral-900 px-2 py-1 rounded border border-neutral-800">
                          {tool.command}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 text-xs text-primary-500 hover:text-primary-400"
                          onClick={() => onExecute(tool.command)}
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Run
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))
              ) : (
                <div className="p-4 text-xs text-neutral-500 italic text-center">No tools found</div>
              )}
            </Accordion>
          </TabsContent>

          <TabsContent value="recon" className="p-0 mt-0">
            <Accordion type="multiple" className="w-full">
              {reconTools.length > 0 ? (
                reconTools.map((tool) => (
                  <AccordionItem key={tool.id} value={tool.id} className="border-b border-neutral-800">
                    <AccordionTrigger className="py-2 px-3 text-xs hover:bg-neutral-800 hover:no-underline">
                      <div className="flex items-center">
                        {tool.icon}
                        <span className="ml-2">{tool.name}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-3 py-2 bg-neutral-950">
                      <div className="text-xs text-neutral-400 mb-2">{tool.description}</div>
                      <div className="flex items-center justify-between">
                        <code className="text-xs bg-neutral-900 px-2 py-1 rounded border border-neutral-800">
                          {tool.command}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 text-xs text-primary-500 hover:text-primary-400"
                          onClick={() => onExecute(tool.command)}
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Run
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))
              ) : (
                <div className="p-4 text-xs text-neutral-500 italic text-center">No reconnaissance tools found</div>
              )}
            </Accordion>
          </TabsContent>

          <TabsContent value="exploit" className="p-0 mt-0">
            <Accordion type="multiple" className="w-full">
              {exploitTools.length > 0 ? (
                exploitTools.map((tool) => (
                  <AccordionItem key={tool.id} value={tool.id} className="border-b border-neutral-800">
                    <AccordionTrigger className="py-2 px-3 text-xs hover:bg-neutral-800 hover:no-underline">
                      <div className="flex items-center">
                        {tool.icon}
                        <span className="ml-2">{tool.name}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-3 py-2 bg-neutral-950">
                      <div className="text-xs text-neutral-400 mb-2">{tool.description}</div>
                      <div className="flex items-center justify-between">
                        <code className="text-xs bg-neutral-900 px-2 py-1 rounded border border-neutral-800">
                          {tool.command}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 text-xs text-primary-500 hover:text-primary-400"
                          onClick={() => onExecute(tool.command)}
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Run
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))
              ) : (
                <div className="p-4 text-xs text-neutral-500 italic text-center">No exploitation tools found</div>
              )}
            </Accordion>
          </TabsContent>

          <TabsContent value="post" className="p-0 mt-0">
            <Accordion type="multiple" className="w-full">
              {postTools.length > 0 ? (
                postTools.map((tool) => (
                  <AccordionItem key={tool.id} value={tool.id} className="border-b border-neutral-800">
                    <AccordionTrigger className="py-2 px-3 text-xs hover:bg-neutral-800 hover:no-underline">
                      <div className="flex items-center">
                        {tool.icon}
                        <span className="ml-2">{tool.name}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-3 py-2 bg-neutral-950">
                      <div className="text-xs text-neutral-400 mb-2">{tool.description}</div>
                      <div className="flex items-center justify-between">
                        <code className="text-xs bg-neutral-900 px-2 py-1 rounded border border-neutral-800">
                          {tool.command}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 text-xs text-primary-500 hover:text-primary-400"
                          onClick={() => onExecute(tool.command)}
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Run
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))
              ) : (
                <div className="p-4 text-xs text-neutral-500 italic text-center">No post-exploitation tools found</div>
              )}
            </Accordion>
          </TabsContent>

          <TabsContent value="utility" className="p-0 mt-0">
            <Accordion type="multiple" className="w-full">
              {utilityTools.length > 0 ? (
                utilityTools.map((tool) => (
                  <AccordionItem key={tool.id} value={tool.id} className="border-b border-neutral-800">
                    <AccordionTrigger className="py-2 px-3 text-xs hover:bg-neutral-800 hover:no-underline">
                      <div className="flex items-center">
                        {tool.icon}
                        <span className="ml-2">{tool.name}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-3 py-2 bg-neutral-950">
                      <div className="text-xs text-neutral-400 mb-2">{tool.description}</div>
                      <div className="flex items-center justify-between">
                        <code className="text-xs bg-neutral-900 px-2 py-1 rounded border border-neutral-800">
                          {tool.command}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 text-xs text-primary-500 hover:text-primary-400"
                          onClick={() => onExecute(tool.command)}
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Run
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))
              ) : (
                <div className="p-4 text-xs text-neutral-500 italic text-center">No utility tools found</div>
              )}
            </Accordion>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
