# Capisco, Working Method, Replit Agent Edition
Last updated: 2026-01-09
Status: Authoritative

## Purpose

This document defines how we work inside Replit using Agent so we move fast without breaking the project.

## Core truth

GitHub is the source of truth.
Replit is the workspace where Agent edits and runs code.
Chat is for planning, review, and decisions.

## Documents Agent must use

Agent uses two docs only:

1. docs/PROJECT_STATE.md  
This includes a short Decisions section inside it.

2. docs/WORKING_METHOD_REPLIT.md  
This file.

Agent must keep docs/PROJECT_STATE.md current.

Note:
The repo may contain other governance docs used by humans or ChatGPT.
Agent does not use them unless PROJECT_STATE.md explicitly tells it to.

## Session start rule

At the start of every Agent session, Agent must do this in order:

1. Read docs/PROJECT_STATE.md and docs/WORKING_METHOD_REPLIT.md
2. State the current phase and the next task in one paragraph
3. State what files it expects to touch
Only then start editing.

If Agent skips this, stop and restart the session.

## Change size rule

Agent must work in small changes.

One goal per change.
Touch as few files as possible.
No refactors unless docs/PROJECT_STATE.md explicitly allows it.

## Testing rule, non negotiable

Agent must not claim something works unless it tested it.

For every change, Agent must do the relevant checks and report results.
Run the app, or run the dev server, or run the test command.

If there are no tests, Agent must at least run the app and confirm the expected screen or output.

If the change cannot be tested in Replit, Agent must say why and what manual step is required.

For UI changes, Agent must visually verify the result before marking the change complete.

## Thorough testing checklist

Before completing any task, Agent must:

1. Restart the workflow if code was changed
2. Run the app and visually verify the expected screen
3. Check console or workflow logs for errors
4. Update docs/PROJECT_STATE.md with what changed and what was tested
5. Only then mark the task complete

## Definition of done for each change

A change is done only when all are true:

Code change is made.
App or tests have been run.
Any errors are fixed or clearly listed.
docs/PROJECT_STATE.md is updated with what changed and what was tested.

## Context decay control

When the session feels confused, repeating, or risky:

Stop.
Re read docs/PROJECT_STATE.md.
Summarise what is currently true.
Continue with one small change only.

## New project intake, first session only

When starting a new app, Agent must ask and record answers in docs/PROJECT_STATE.md:

What platforms must be supported now. Android, iOS, web.
What platforms might be needed later.
Is this a prototype or a long term product.
Do we need login, payments, push notifications, offline, sync, background tasks.
Data and storage needs. Local only, cloud, database.
Deployment target. App store, web hosting, internal only.
Team size. Solo or shared.

Then Agent must recommend a stack and write the decision into docs/PROJECT_STATE.md.

## Safety rails

Agent must never do these without asking first:

Delete databases.
Delete large folders.
Replace the whole app structure.
Migrate frameworks.

If something big is needed, Agent proposes a plan and waits.
