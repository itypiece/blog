---
title: 我的NeoVim配置
publish_date: 2023-08-18
tags: ["Linux", "NeoVim"]
---

 
# 插件管理器的安装

```shell
curl -fLo ~/.config/nvim/autoload/plug.vim --create-dirs \
    https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
```

# 配置文件

~/.config/nvim/init.vim

```shell
" 通用设置
set nocompatible
set encoding=utf-8
set autoindent
set smartindent
set expandtab
set tabstop=4
set shiftwidth=4
set undofile
set undodir=~/.vim/undodir

" 识别mdx文件为markdown类型
au BufNewFile,BufRead *.mdx set filetype=markdown

" 插件管理器设置
call plug#begin('~/.config/nvim/plugged')

" 代码提示和语法检查插件
Plug 'neoclide/coc.nvim', {'branch': 'release'}

" gruvbox主题
Plug 'morhetz/gruvbox'

" NERDTree 插件
Plug 'preservim/nerdtree'

" 状态栏
Plug 'itchyny/lightline.vim'

" vim-floaterm 插件
Plug 'voldikss/vim-floaterm'


call plug#end()


" 语法高亮
syntax enable
:colorscheme gruvbox


" 命令 RUN 来智能运行不同文件类型
command! -nargs=0 -bang RUN call SmartRun()

function! SmartRun()
  let filename = expand('%')
  let file_extension = fnamemodify(filename, ':e')
  let current_dir = getcwd()

  if file_extension ==# 'c'
    let cmd = "cd " . current_dir . " && gcc % -o %:r.out && ./%:r.out"
  elseif file_extension ==# 'cpp'
    let cmd = "cd " . current_dir . " && g++ % -o %:r.out && ./%:r.out"
  elseif file_extension ==# 'py'
    let cmd = "cd " . current_dir . " && python3 %"
  elseif file_extension ==# 'rs'
    let cmd = "cd " . current_dir . " && rustc % -o %:r.out && ./%:r.out"
  elseif file_extension ==# 'go'
    let cmd = "cd " . current_dir . " && go run %"
  elseif file_extension ==# 'kt'
    let cmd = "cd " . current_dir . " && kotlinc % -include-runtime -d %:r.jar && java -jar %:r.jar"
  elseif file_extension ==# 'java'
    let cmd = "cd " . current_dir . " && javac % && java %:r"
  elseif file_extension ==# 'rb'
    let cmd = "cd " . current_dir . " && ruby %"
  elseif file_extension ==# 'ts'
    let cmd = "cd " . current_dir . " && tsc % && node %:r.js"
  else
    let cmd = ""
  endif

  if !empty(cmd)
    let cmd .= " && read -p 'Press Enter to continue...'"
    execute "FloatermNew --wintype=normal --height=0.4 --position=bottom sh -c " . shellescape('clear && ' . cmd)
  else
    echo "Unsupported file type!"
  endif
endfunction


" 命令 WEBRUN 来运行本地服务器
command! -nargs=0 -bang WEBRUN call RunLocalServer()

function! RunLocalServer()
    let server_cmd = "python3 -m http.server"

  let cmd = server_cmd . " && read -p 'Press Enter to stop the server...'"

  execute "FloatermNew --wintype=normal --height=0.4 --position=bottom sh -c " . shellescape('clear && ' . cmd)
endfunction


" 命令 NPMRUN 来运行NodeJS项目
command! -nargs=0 -bang NPMRUN call RunNPM()

function! RunNPM()
  let npm_cmd = "npm run dev"

  let cmd = npm_cmd

  execute "FloatermNew --wintype=normal --height=0.4 --position=bottom sh -c " . shellescape('clear && ' . cmd)
endfunction


" 命令 PUSH 来上传文件到GIT仓库
command! -nargs=0 -bang PUSH call GitPush()

function! GitPush()
  FloatermNew --wintype=normal --height=0.4 --position=bottom sh -c "git add . && git commit -m 'Push' && git push"
endfunction


" 启用 lightline.vim 插件
set laststatus=2
let g:lightline = {
    \ 'colorscheme': 'nord',
    \ 'active': {
    \   'left': [ ['mode', 'paste'], ['readonly', 'filename', 'modified', 'lineinfo'] ],
    \   'right': [ ['filetype'] ]
    \ },
    \ }

" 使用 lightline 提供的函数获取当前行号和百分比的行数
function! LightlineLineInfo()
    let current_line = line('.')
    let total_lines = line('$')
    let percent = current_line * 100 / total_lines
    return 'Line ' . current_line . ' (' . percent . '%)'
endfunction

" 将 lightline 的组件 lineinfo 设置为自定义函数
let g:lightline.component_function = {
    \ 'lineinfo': 'LightlineLineInfo',
    \ }

" 配置COC
let g:coc_global_extensions = [
    \ 'coc-clangd',
    \ 'coc-python',
    \ 'coc-tsserver',
    \ 'coc-eslint',
    \ 'coc-go',
    \ 'coc-rls',
    \ 'coc-java',
    \ 'coc-css',
    \ ]


" 命令 FMT 格式化代码
command! -nargs=0 -bang FMT call FormatCode()

function! FormatCode()
  let file_extension = expand('%:e')
  let cmd = ''

  if file_extension ==# 'c' || file_extension ==# 'cpp'
    let cmd = 'clang-format -i %'
  elseif file_extension ==# 'py'
    let cmd = 'yapf -i %'
  elseif file_extension ==# 'rs'
    let cmd = 'rustfmt --emit=stdout % | tee %'
  elseif file_extension ==# 'ts' || file_extension ==# 'js' ||
        \ file_extension ==# 'jsx' || file_extension ==# 'mjs' ||
        \ file_extension ==# 'vue' || file_extension ==# 'angular'
    let cmd = 'prettier --write %'
  elseif file_extension ==# 'html'
    let cmd = 'prettier --parser html --write %'
  elseif file_extension ==# 'css'
    let cmd = 'prettier --parser css --write %'
elseif file_extension ==# 'tsx'
    let cmd = 'prettier  --write %'
  elseif file_extension ==# 'kt'
    let cmd = 'ktlint -F %'
  elseif file_extension ==# 'go'
    let cmd = 'goimports -w %'
  elseif file_extension ==# 'json' || file_extension ==# 'graphql' ||
        \ file_extension ==# 'md' || file_extension ==# 'mdx' ||
        \ file_extension ==# 'yaml'
    let cmd = 'prettier --write %'
  else
    echo "Unsupported file type!"
  endif

  if !empty(cmd)
    silent execute "FloatermNew --wintype=normal --height=0.1 --position=bottom sh -c " . shellescape('clear && ' . cmd)
  endif
endfunction


" 启用智能代码提示
inoremap <silent><expr> <Tab> pumvisible() ? "\<C-n>" : "\<Tab>"
inoremap <silent><expr> <S-Tab> pumvisible() ? "\<C-p>" : "\<S-Tab>"


" COC.nvim 快捷键映射
nmap <leader>rn <Plug>(coc-restart)
nmap <leader>qq <Plug>(coc-diagnostic-prev)
nmap <leader>ww <Plug>(coc-diagnostic-next)



" 启用 NERDTree
nmap <leader>n :NERDTreeToggle<CR>
let NERDTreeShowHidden=1
let NERDTreeWinPos = "left"

let g:nerdtree_map_keys = 1
```
