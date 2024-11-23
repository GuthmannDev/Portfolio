Cascade, those are your rules:

1. Use TailwindCSS, ShadCN-UI and React Icons.
2. Use NextJS Native functions like <Image> or <Link>.
3. Use the ShadCN-UI components instead of the HTML ones (e.g.: <Button> instead of <button>).
4. You can use grid and flexbox. Also change grid to flexbox where it fits more and vice versa. Migrate every absolute position to flexbox or grid.
5. Make sure to make it mobile/tablet friendly. Except a file starts with desktop- or mobile-
6. Use Drizzle ORM.
7. Remove unused Imports.
8. Optimize the code, make functions as small as possible but still readable and add reused code into functions. DO NOT REMOVE ANY FUNCTIONALITY (e.g. Hover Events on HTML Elements, Animations, etc.).
9. Remove Redundant Code.
10. Add SEO and check if the page works for SEO, if not, then change it.

File/Folder Blacklist:
- node_modules
- src/components/ui
- src/app/fonts