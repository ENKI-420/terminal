interface CommandResult {
  output: string
  type: "output" | "error" | "warning" | "info" | "success" | "system"
  exitCode: number
  metadata?: Record<string, any>
}

export function simulateSystemCommand(
  command: string,
  args: string[],
  contextData: Record<string, any>,
): CommandResult {
  // Simulate common system commands
  switch (command) {
    case "ls":
      return simulateLsCommand(args)

    case "ps":
      return simulatePsCommand(args)

    case "top":
      return simulateTopCommand()

    case "uname":
      return simulateUnameCommand(args)

    case "date":
      return {
        output: new Date().toString(),
        type: "output",
        exitCode: 0,
      }

    case "uptime":
      return {
        output: `14:23:52 up 7 days, 2:43, 3 users, load average: 0.52, 0.58, 0.59`,
        type: "output",
        exitCode: 0,
      }

    case "id":
      return {
        output: `uid=1000(operator) gid=1000(operator) groups=1000(operator),4(adm),24(cdrom),27(sudo)`,
        type: "output",
        exitCode: 0,
      }

    case "df":
      return simulateDfCommand(args)

    case "free":
      return simulateFreeCommand(args)

    case "ip":
    case "ifconfig":
      return simulateNetworkInfoCommand(args)

    case "help":
      return {
        output: `
Available commands:

System:
  ls, cd, pwd, cat, echo, touch, mkdir, rm, cp, mv
  ps, top, uname, date, uptime, id, df, free
  ip, ifconfig, whoami, hostname, clear

Network:
  ssh, nc, telnet, curl, wget, ping

Penetration Testing:
  nmap, gobuster, sqlmap, metasploit, msfconsole, hydra, wpscan, nikto

Special:
  sequence - Run a sequence of commands (e.g., sequence "ls" "pwd" "echo hello")
  help - Display this help message

Use Tab for command completion and Up/Down arrows for command history.
Press Ctrl+L to clear the screen.
`,
        type: "info",
        exitCode: 0,
      }

    default:
      return {
        output: `Command not found: ${command}. Type 'help' for available commands.`,
        type: "error",
        exitCode: 127,
      }
  }
}

function simulateLsCommand(args: string[]): CommandResult {
  // Check for flags
  const showAll = args.includes("-a") || args.includes("-la") || args.includes("-al")
  const longFormat = args.includes("-l") || args.includes("-la") || args.includes("-al")

  // Simulate directory contents
  const files = [
    {
      name: "file1.txt",
      size: 1024,
      permissions: "-rw-r--r--",
      owner: "operator",
      group: "operator",
      date: "Jan 15 14:32",
    },
    {
      name: "file2.txt",
      size: 2048,
      permissions: "-rw-r--r--",
      owner: "operator",
      group: "operator",
      date: "Feb 20 10:15",
    },
    {
      name: "script.sh",
      size: 512,
      permissions: "-rwxr-xr-x",
      owner: "operator",
      group: "operator",
      date: "Mar 05 09:22",
    },
    {
      name: "data.json",
      size: 4096,
      permissions: "-rw-r--r--",
      owner: "operator",
      group: "operator",
      date: "Apr 10 16:45",
    },
    { name: "images", size: 0, permissions: "drwxr-xr-x", owner: "operator", group: "operator", date: "May 03 11:30" },
  ]

  const hiddenFiles = [
    { name: ".config", size: 0, permissions: "drwxr-xr-x", owner: "operator", group: "operator", date: "Jan 02 08:15" },
    {
      name: ".bashrc",
      size: 3072,
      permissions: "-rw-r--r--",
      owner: "operator",
      group: "operator",
      date: "Jan 01 00:00",
    },
  ]

  // Format output based on flags
  if (longFormat) {
    let output = "total 16\n"

    if (showAll) {
      output += `drwxr-xr-x  2 operator operator 4096 Jun 01 12:00 .\n`
      output += `drwxr-xr-x  4 operator operator 4096 Jun 01 12:00 ..\n`

      for (const file of hiddenFiles) {
        output += `${file.permissions} 1 ${file.owner} ${file.group} ${file.size.toString().padStart(5)} ${file.date} ${file.name}\n`
      }
    }

    for (const file of files) {
      output += `${file.permissions} 1 ${file.owner} ${file.group} ${file.size.toString().padStart(5)} ${file.date} ${file.name}\n`
    }

    return {
      output: output.trim(),
      type: "output",
      exitCode: 0,
    }
  } else {
    // Simple format
    let fileList = files.map((f) => f.name)

    if (showAll) {
      fileList = [".", "..", ...hiddenFiles.map((f) => f.name), ...fileList]
    }

    return {
      output: fileList.join("  "),
      type: "output",
      exitCode: 0,
    }
  }
}

function simulatePsCommand(args: string[]): CommandResult {
  // Check for flags
  const showAll = args.includes("-a") || args.includes("-e") || args.includes("-A")
  const fullFormat = args.includes("-f") || args.includes("-F")

  // Simulate process list
  const processes = [
    { pid: 1, user: "root", command: "/sbin/init", cpu: "0.0", mem: "0.1", time: "00:00:01" },
    { pid: 854, user: "root", command: "/usr/sbin/sshd -D", cpu: "0.0", mem: "0.3", time: "00:00:02" },
    { pid: 1024, user: "operator", command: "bash", cpu: "0.0", mem: "0.2", time: "00:00:05" },
    { pid: 1138, user: "operator", command: "ps aux", cpu: "0.1", mem: "0.1", time: "00:00:00" },
  ]

  if (showAll && fullFormat) {
    // Full format with all processes
    let output = "UID        PID  PPID  C STIME TTY          TIME CMD\n"
    output += `root         1     0  0 Jun01 ?        00:00:01 /sbin/init\n`
    output += `root       854     1  0 Jun01 ?        00:00:02 /usr/sbin/sshd -D\n`
    output += `operator  1024   854  0 Jun01 pts/0    00:00:05 bash\n`
    output += `operator  1138  1024  0 Jun01 pts/0    00:00:00 ps aux\n`

    return {
      output,
      type: "output",
      exitCode: 0,
    }
  } else if (fullFormat) {
    // Full format with user processes
    let output = "UID        PID  PPID  C STIME TTY          TIME CMD\n"
    output += `operator  1024   854  0 Jun01 pts/0    00:00:05 bash\n`
    output += `operator  1138  1024  0 Jun01 pts/0    00:00:00 ps aux\n`

    return {
      output,
      type: "output",
      exitCode: 0,
    }
  } else if (showAll) {
    // Simple format with all processes
    let output = "  PID TTY          TIME CMD\n"
    output += `    1 ?        00:00:01 init\n`
    output += `  854 ?        00:00:02 sshd\n`
    output += ` 1024 pts/0    00:00:05 bash\n`
    output += ` 1138 pts/0    00:00:00 ps\n`

    return {
      output,
      type: "output",
      exitCode: 0,
    }
  } else {
    // Simple format with user processes
    let output = "  PID TTY          TIME CMD\n"
    output += ` 1024 pts/0    00:00:05 bash\n`
    output += ` 1138 pts/0    00:00:00 ps\n`

    return {
      output,
      type: "output",
      exitCode: 0,
    }
  }
}

function simulateTopCommand(): CommandResult {
  const output = `
top - 14:30:15 up 7 days,  2:43,  1 user,  load average: 0.52, 0.58, 0.59
Tasks: 128 total,   1 running, 127 sleeping,   0 stopped,   0 zombie
%Cpu(s):  2.3 us,  1.2 sy,  0.0 ni, 96.4 id,  0.0 wa,  0.0 hi,  0.1 si,  0.0 st
MiB Mem :   7861.1 total,   4234.5 free,   1831.8 used,   1794.8 buff/cache
MiB Swap:   2048.0 total,   2048.0 free,      0.0 used.   5584.0 avail Mem 

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND                       
 1138 operator  20   0   10256   3768   3168 R   0.7   0.0   0:00.02 top                           
    1 root      20   0  168908  13456   8948 S   0.0   0.2   0:01.45 systemd                       
  854 root      20   0   12768   6980   6064 S   0.0   0.1   0:00.32 sshd                          
 1024 operator  20   0   10256   3768   3168 S   0.0   0.0   0:00.15 bash                          
`

  return {
    output: output.trim(),
    type: "output",
    exitCode: 0,
  }
}

function simulateUnameCommand(args: string[]): CommandResult {
  // Check for flags
  const all = args.includes("-a")
  const kernel = args.includes("-s") || args.length === 0
  const nodename = args.includes("-n")
  const kernelVersion = args.includes("-v")
  const machine = args.includes("-m")
  const processor = args.includes("-p")
  const os = args.includes("-o")

  if (all) {
    return {
      output: "Linux pentest-system 5.15.0-kali1-amd64 #1 SMP Debian 5.15.15-2kali1 (2022-01-31) x86_64 GNU/Linux",
      type: "output",
      exitCode: 0,
    }
  }

  let output = ""

  if (kernel) output += "Linux "
  if (nodename) output += "pentest-system "
  if (kernelVersion) output += "5.15.0-kali1-amd64 #1 SMP Debian 5.15.15-2kali1 (2022-01-31) "
  if (machine) output += "x86_64 "
  if (processor) output += "x86_64 "
  if (os) output += "GNU/Linux"

  return {
    output: output.trim(),
    type: "output",
    exitCode: 0,
  }
}

function simulateDfCommand(args: string[]): CommandResult {
  // Check for flags
  const human = args.includes("-h")

  if (human) {
    return {
      output: `
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        30G   15G   14G  52% /
tmpfs           3.9G     0  3.9G   0% /dev/shm
/dev/sda2       450G  228G  199G  54% /data
`,
      type: "output",
      exitCode: 0,
    }
  } else {
    return {
      output: `
Filesystem     1K-blocks     Used Available Use% Mounted on
/dev/sda1       31457280 15728640 14680064  52% /
tmpfs            4030680        0  4030680   0% /dev/shm
/dev/sda2      471859200 239206400 208486400  54% /data
`,
      type: "output",
      exitCode: 0,
    }
  }
}

function simulateFreeCommand(args: string[]): CommandResult {
  // Check for flags
  const human = args.includes("-h")

  if (human) {
    return {
      output: `
              total        used        free      shared  buff/cache   available
Mem:          7.7Gi       1.8Gi       4.1Gi       0.0Ki       1.8Gi       5.5Gi
Swap:         2.0Gi       0.0Ki       2.0Gi
`,
      type: "output",
      exitCode: 0,
    }
  } else {
    return {
      output: `
              total        used        free      shared  buff/cache   available
Mem:        8050368     1875968     4336128          0     1838272     5718528
Swap:       2097152           0     2097152
`,
      type: "output",
      exitCode: 0,
    }
  }
}

function simulateNetworkInfoCommand(args: string[]): CommandResult {
  if (args.includes("addr") || args.includes("-a")) {
    return {
      output: `
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host 
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 00:0c:29:b5:72:37 brd ff:ff:ff:ff:ff:ff
    inet 192.168.1.100/24 brd 192.168.1.255 scope global dynamic noprefixroute eth0
       valid_lft 86390sec preferred_lft 86390sec
    inet6 fe80::20c:29ff:feb5:7237/64 scope link 
       valid_lft forever preferred_lft forever
`,
      type: "output",
      exitCode: 0,
    }
  } else {
    return {
      output: `
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.1.100  netmask 255.255.255.0  broadcast 192.168.1.255
        inet6 fe80::20c:29ff:feb5:7237  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:b5:72:37  txqueuelen 1000  (Ethernet)
        RX packets 15483  bytes 1839284 (1.7 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 8347  bytes 1070004 (1.0 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 248  bytes 20640 (20.1 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 248  bytes 20640 (20.1 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
`,
      type: "output",
      exitCode: 0,
    }
  }
}
