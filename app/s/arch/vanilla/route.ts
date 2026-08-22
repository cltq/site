const text = `sudo pacman -S --needed --noconfirm \
  base-devel gcc cmake make fakeroot doas pkgconf automake autoconf \
  boost openssl clang clang-tools-extra gdb valgrind strace \
  python python-pip python-virtualenv python-pytest python-black python-tox \
  python-requests python-aiohttp python-httpx python-sqlalchemy python-starlette \
  git git-lfs github-cli nodejs npm go \
  curl wget unzip zip \
  vim neovim zsh \
  fzf fastfetch htop btop tmux tree less \
  reflector rsync lsof man-db iniparser \
  aria2 httpie tig \
  openssh doas \
  pkg-config libtool \
  zoxide \
  flatpak gtk4 qt6-base sdl2 prismlauncher orca \
  noto-fonts noto-fonts-emoji ttf-jetbrains-mono ttf-jetbrains-mono-nerd ttf-fira-code ttf-roboto ttf-dejavu \
  noto-fonts-cjk ttf-liberation ttf-ubuntu-font-family`;

export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(text, {
    headers: { "Content-Type": "text/plain" },
  });
}
