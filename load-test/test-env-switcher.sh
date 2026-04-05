#!/bin/bash

# 📋 压力测试环境配置脚本
# 快速切换本地和 Vercel 环境进行测试

set -e

# ============ 配置 ============

# 设置你的 Vercel URL（**必须修改这里！**）
VERCEL_URL="https://anti-dv.vercel.app"

# 本地开发 URL
LOCAL_URL="http://localhost:3000"

# ============ 颜色定义 ============
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# ============ 函数 ============

show_menu() {
  clear
  echo -e "${BLUE}════════════════════════════════════════${NC}"
  echo -e "${BLUE}📍 压力测试环境选择${NC}"
  echo -e "${BLUE}════════════════════════════════════════${NC}"
  echo ""
  echo "当前配置:"
  echo -e "  🌐 Vercel URL: ${YELLOW}$VERCEL_URL${NC}"
  echo -e "  💻 本地 URL:   ${YELLOW}$LOCAL_URL${NC}"
  echo ""
  echo "选择测试环境:"
  echo "  1) 本地环境 ($LOCAL_URL)"
  echo "  2) Vercel 环境 ($VERCEL_URL)"
  echo "  3) 修改 Vercel URL"
  echo "  4) 退出"
  echo ""
}

update_vercel_url() {
  echo ""
  read -p "输入你的 Vercel URL (例如: https://my-app.vercel.app): " new_url
  if [[ ! $new_url =~ ^https?:// ]]; then
    echo -e "${RED}❌ URL 格式不正确，必须以 http:// 或 https:// 开头${NC}"
    return
  fi
  
  VERCEL_URL=$new_url
  echo -e "${GREEN}✓ Vercel URL 已更新: $VERCEL_URL${NC}"
  
  # 保存到文件以便下次使用
  echo "VERCEL_URL=$VERCEL_URL" > /tmp/test-env-config.sh
  echo -e "${GREEN}✓ 配置已保存${NC}"
  
  sleep 2
}

test_local() {
  echo ""
  echo -e "${BLUE}🚀 开始本地环境压力测试${NC}"
  echo ""
  echo "确保前端已启动: npm run dev"
  echo ""
  
  read -p "继续? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    return
  fi
  
  # 检查本地服务是否运行
  if ! curl -s http://localhost:3000 > /dev/null; then
    echo -e "${RED}❌ 本地前端未运行，请先执行 npm run dev${NC}"
    sleep 2
    return
  fi
  
  echo ""
  echo -e "${YELLOW}选择测试:${NC}"
  echo "  1) 前端 UI 压力测试 (Playwright)"
  echo "  2) 后端 API 压力测试 (k6)"
  echo "  3) 两个都测试"
  echo ""
  
  read -p "选择 (1-3): " test_choice
  
  case $test_choice in
    1)
      echo ""
      echo -e "${BLUE}运行前端 UI 测试...${NC}"
      TEST_BASE_URL=$LOCAL_URL pnpm ts-node load-test/playwright-ui-test.ts
      ;;
    2)
      echo ""
      echo -e "${BLUE}运行后端 API 测试...${NC}"
      k6 run load-test/k6-api-test.js
      ;;
    3)
      echo ""
      echo -e "${BLUE}运行两个测试...${NC}"
      TEST_BASE_URL=$LOCAL_URL pnpm ts-node load-test/playwright-ui-test.ts &
      sleep 3
      k6 run load-test/k6-api-test.js
      wait
      ;;
  esac
  
  sleep 2
}

test_vercel() {
  echo ""
  echo -e "${BLUE}🚀 开始 Vercel 环境压力测试${NC}"
  echo ""
  echo "测试目标: $VERCEL_URL"
  echo ""
  
  # 检查 URL 是否可访问
  echo -e "${YELLOW}检查 Vercel 应用是否可访问...${NC}"
  if ! curl -s "$VERCEL_URL" > /dev/null; then
    echo -e "${RED}❌ 无法访问 $VERCEL_URL${NC}"
    echo "请检查:"
    echo "  1. URL 是否正确"
    echo "  2. Vercel 应用是否部署成功"
    echo "  3. 网络连接是否正常"
    sleep 3
    return
  fi
  
  echo -e "${GREEN}✓ Vercel 应用可访问${NC}"
  echo ""
  
  echo -e "${YELLOW}选择测试:${NC}"
  echo "  1) 前端 UI 压力测试 (Playwright)"
  echo "  2) 后端 API 压力测试 (k6)"
  echo "  3) 两个都测试"
  echo ""
  
  read -p "选择 (1-3): " test_choice
  
  case $test_choice in
    1)
      echo ""
      echo -e "${BLUE}运行前端 UI 测试...${NC}"
      echo "命令: TEST_BASE_URL=$VERCEL_URL pnpm ts-node load-test/playwright-ui-test.ts"
      echo ""
      TEST_BASE_URL=$VERCEL_URL pnpm ts-node load-test/playwright-ui-test.ts
      ;;
    2)
      echo ""
      echo -e "${BLUE}运行后端 API 测试...${NC}"
      echo "命令: BASE_URL=$VERCEL_URL/api k6 run load-test/k6-api-test.js"
      echo ""
      BASE_URL=$VERCEL_URL/api k6 run load-test/k6-api-test.js
      ;;
    3)
      echo ""
      echo -e "${BLUE}运行两个测试...${NC}"
      TEST_BASE_URL=$VERCEL_URL pnpm ts-node load-test/playwright-ui-test.ts &
      sleep 3
      BASE_URL=$VERCEL_URL/api k6 run load-test/k6-api-test.js
      wait
      ;;
  esac
  
  sleep 2
}

# ============ 主程序 ============

# 尝试加载之前保存的配置
if [ -f /tmp/test-env-config.sh ]; then
  source /tmp/test-env-config.sh
fi

while true; do
  show_menu
  read -p "请选择 (1-4): " choice
  
  case $choice in
    1)
      test_local
      ;;
    2)
      test_vercel
      ;;
    3)
      update_vercel_url
      ;;
    4)
      echo -e "${GREEN}✓ 退出${NC}"
      exit 0
      ;;
    *)
      echo -e "${RED}❌ 无效选择${NC}"
      sleep 1
      ;;
  esac
done
