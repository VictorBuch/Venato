 <!DOCTYPE html>
 <html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

 <head>
     <meta charset="utf-8">
     <meta name="viewport" content="width=device-width, initial-scale=1">

     <!-- Scripts and CSS import -->
     @vite
 </head>

 <body class="antialiased">
     <div id="root">
     </div>
     <script type="text/javascript" src="{{ asset('scr/scripts/main.tsx') }}"></script>
 </body>

 </html>