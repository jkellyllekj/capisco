# Working Method: Replit Agent Protocol

This document defines the strict protocol for all agent instructions in this repository.

## 1. Instruction Boundary Rule

The agent must ONLY act on instructions contained inside a single code block.

That code block will always be preceded by the literal line:

```
START MESSAGE TO AGENT
```

And followed by the literal line:

```
FINISH MESSAGE TO AGENT
```

Any text outside the code block is non-authoritative and must be ignored.

## 2. Copy Discipline Rule

The human copies the code block verbatim.

Therefore all executable instructions MUST be fully self-contained inside the code block.

No commentary, explanation, or prose outside the code block may be relied upon.

## 3. Noise File Prohibition

The agent must NEVER create files containing pasted instructions, prompts, or helper text.

Files such as:
- `Pasted-START-MESSAGE-TO-AGENT*.txt`
- Scratch notes
- Temporary instruction artifacts

are explicitly forbidden.

If such a file is created accidentally, it must be deleted before committing.

## 4. Execution Authority

- ChatGPT plans and governs.
- The Replit Agent executes only what is written in the code block.
- No inference, continuation, or extrapolation is permitted.

## 5. Commit Hygiene

Before any commit:
1. Verify no instruction artifacts exist in the working tree
2. Verify no pasted prompt files are staged
3. Only commit files explicitly mentioned in the instruction scope
