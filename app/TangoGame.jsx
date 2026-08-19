import React, { useState, useRef } from 'react';
import { StyleSheet, SafeAreaView, View, Alert, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import tangoHtml from '../src/assets/Mini Games/tango/tangoHtml';
import BreakTimerOverlay from '../src/components/BreakTimerOverlay';
import { useGlobalTheme } from './themeStore';

// Inject CSS to ensure the game takes up the full dimensions of the WebView
const INJECTED_CSS = `
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
    
    html, body, * {
      font-family: 'Poppins', sans-serif !important;
    }

    html, body {
      margin: 0;
      padding: 0;
      width: 100vw;
      min-height: 100vh;
      overflow-x: hidden;
      overflow-y: auto;
      background-color: #FDFBF4;
    }
    
    /* Ensure dark mode sets the proper background and text colors */
    html.dark, html.dark body {
      background-color: #111827 !important;
      color: #F9FAFB !important;
    }
    
    /* --- Game Controls Customization --- */
    
    /* Game level select dropdown exactly matches New Game button styling */
    select#difficulty-select {
      margin: 6px !important;
      padding: 12px 16px !important;
      background-color: #ffffff !important;
      color: black !important;
      border: 1px solid #D9DCE0 !important;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
      font-size: 0.875rem !important;
      font-weight: 600 !important;
      
      -webkit-appearance: none !important;
      appearance: none !important;
      text-align: center !important;
      text-align-last: center !important;
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
    }
    
    @media (min-width: 640px) {
      select#difficulty-select {
        font-size: 1rem !important;
      }
    }
    
    /* Customize all Game Control buttons (New Game, Reset, Undo, Hint) */
    button#custom-new-game-btn,
    button[class*="bg-amber-"],
    button[class*="bg-orange-"],
    button[class*="bg-gray-500"],
    button[class*="bg-blue-"] {
      margin: 6px !important;
      padding: 12px 16px !important;
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
      gap: 6px !important;
      background-color: #ffffff !important;
      color: black !important;
      border: 1px solid #D9DCE0 !important;
      font-size: 0.875rem !important;
      font-weight: 600 !important;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
    }
    
    /* Force control buttons to always show text next to emoji on mobile screens */
    button[class*="bg-amber-"] span.hidden,
    button[class*="bg-orange-"] span.hidden,
    button[class*="bg-gray-500"] span.hidden {
      display: inline-flex !important;
      align-items: center !important;
      gap: 4px !important;
    }
    
    /* Hide the emoji-only fallback spans that Svelte shows on mobile */
    button[class*="bg-amber-"] span[class*="sm:hidden"],
    button[class*="bg-orange-"] span[class*="sm:hidden"],
    button[class*="bg-gray-500"] span[class*="sm:hidden"] {
      display: none !important;
    }
    
    /* Ensure inner spans that take up 100% width still center their internal text */
    button#custom-new-game-btn *,
    button[class*="bg-amber-"] *,
    button[class*="bg-orange-"] *,
    button[class*="bg-gray-500"] *,
    button[class*="bg-blue-"] * {
      text-align: center !important;
      justify-content: center !important;
    }
    
    /* Exclude the built-in dark mode toggle from this styling */
    button[class*="w-14"][class*="rounded-full"][class*="border-2"] {
      display: none !important;
    }
    
    @media (min-width: 640px) {
      button#custom-new-game-btn,
      button[class*="bg-amber-"],
      button[class*="bg-orange-"],
      button[class*="bg-gray-500"],
      button[class*="bg-blue-"] {
        font-size: 1rem !important;
      }
    }
    
    /* Ensure emojis and inner spans inherit the same colors */
    button#custom-new-game-btn span,
    button[class*="bg-amber-"] span,
    button[class*="bg-orange-"] span,
    button[class*="bg-gray-500"] span,
    button[class*="bg-blue-"] span {
      color: inherit !important;
      font-size: inherit !important;
      background-color: transparent !important;
    }
    
    /* Dark mode overrides for Game Controls */
    html.dark select#difficulty-select,
    html.dark button#custom-new-game-btn,
    html.dark button[class*="bg-amber-"],
    html.dark button[class*="bg-orange-"],
    html.dark button[class*="bg-gray-500"],
    html.dark button[class*="bg-blue-"] {
      background-color: #334155 !important;
      color: white !important;
      border: 1px solid #475569 !important;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3) !important;
    }
    
    /* --- End Game Controls Customization --- */

    /* --- Game Board Responsiveness --- */
    
    /* Since Svelte games often use absolute pixel math for tiles and constraints, 
       fluid CSS sizing breaks the layout. Instead, we use 'zoom' to proportionately 
       shrink the entire rendered board to fit mobile screens flawlessly. */
    .game-board-container {
      width: 100% !important;
      display: flex !important;
      justify-content: center !important;
      /* Allow horizontal scrolling instead of forcefully chopping off outlines */
      overflow-x: auto !important;
    }
    
    .game-board {
      /* Force the board to fully expand and preserve both left and right padding */
      width: fit-content !important;
      margin: 0 auto !important;
      
      /* Fallback for engines that support zoom */
      zoom: 1.06 !important;
      /* Industry-standard scaling for all WebViews */
      transform: scale(1.06) !important;
      transform-origin: top center !important;
    }
    
    /* Compensate for the 1.06 scaling so the 'No game loaded' text isn't tiny */
    .game-board p {
      font-size: 1rem !important;
      line-height: 1.6 !important;
    }
    
    /* Aggressive scaling for smaller phones */
    @media (max-width: 380px) {
      .game-board {
        zoom: 1.0 !important;
        transform: scale(1.0) !important;
      }
      .game-board p {
        font-size: 1.05rem !important;
      }
    }
    
    @media (max-width: 340px) {
      .game-board {
        zoom: 0.94 !important;
        transform: scale(0.94) !important;
      }
      .game-board p {
        font-size: 1.1rem !important;
      }
    }
    
    /* --- End Game Board Responsiveness --- */
    
    /* Hide the SvelteKit built-in dark mode toggle button */
    button[class*="w-14"][class*="rounded-full"][class*="border-2"] {
      display: none !important;
    }
    
    /* Hide the footer text */
    footer {
      display: none !important;
    }
    
    #svelte, #app, body > div {
      width: 100%;
      min-height: 100%;
    }
  </style>
`;

// Insert the styles right before the closing head tag, or append if not found
let adjustedHtml = tangoHtml.includes('</head>')
  ? tangoHtml.replace('</head>', INJECTED_CSS + '</head>')
  : tangoHtml + INJECTED_CSS;

// Move the inline script from <head> to the end of <body> so it can access the #app element
// Note: 'defer' does not work on inline scripts, so we must physically move it in the HTML
const scriptStart = '<script type="text/javascript">';
const scriptEnd = '</script>';

const startIndex = adjustedHtml.indexOf(scriptStart);
const endIndex = adjustedHtml.indexOf(scriptEnd, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
  const fullScript = adjustedHtml.substring(startIndex, endIndex + scriptEnd.length);
  // Remove it from its original position in the head
  adjustedHtml = adjustedHtml.replace(fullScript, '');
  // Place it right before the closing body tag so the DOM is ready
  adjustedHtml = adjustedHtml.replace('</body>', fullScript + '</body>');
}

const ERROR_CATCHER = `
<script>
  // Force 1x pixel ratio for massive performance boost on low-end androids
  Object.defineProperty(window, 'devicePixelRatio', { get: () => 1 });
  
  window.onerror = function(msg, url, line, col, err) {
    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', message: msg + ' at ' + line + ':' + col }));
  };
  
  // Override matchMedia to trick Svelte into thinking the device is fundamentally in Light Mode
  const originalMatchMedia = window.matchMedia;
  window.matchMedia = function(query) {
    if (query === '(prefers-color-scheme: dark)') {
      return { matches: false, media: query, onchange: null, addListener: function(){}, removeListener: function(){}, addEventListener: function(){}, removeEventListener: function(){}, dispatchEvent: function(){ return false; } };
    }
    return originalMatchMedia(query);
  };
  
  // Brutally enforce React Native's desired state using a MutationObserver
  window.__REACT_NATIVE_DARK_MODE__ = false;
  document.documentElement.classList.remove('dark');
  
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.attributeName === 'class') {
        var hasDark = document.documentElement.classList.contains('dark');
        if (hasDark && !window.__REACT_NATIVE_DARK_MODE__) {
          document.documentElement.classList.remove('dark');
        } else if (!hasDark && window.__REACT_NATIVE_DARK_MODE__) {
          document.documentElement.classList.add('dark');
        }
      }
    });
  });
  observer.observe(document.documentElement, { attributes: true });
  
  // Svelte dynamically renders the button, and Tailwind might hash the classes.
  // We use an interval to hunt for the button and manually assign it a secure ID for our CSS.
  setInterval(function() {
    var btns = document.querySelectorAll('button');
    for (var i = 0; i < btns.length; i++) {
      if (btns[i].textContent.toLowerCase().indexOf('new') !== -1) {
        btns[i].id = 'custom-new-game-btn';
      }
    }
  }, 500);

  // --- AUDIO SYNTHESIS ---
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  let audioCtx;
  function initAudio() {
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();
  }
  
  function playPop(freq = 600, duration = 0.1) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq / 2, audioCtx.currentTime + duration);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  }