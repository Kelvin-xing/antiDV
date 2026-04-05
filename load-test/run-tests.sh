#!/bin/bash

# 色彩定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 函数：打印带颜色的标题
print_header() {
  echo -e "${BLUE}================================${NC}"
  echo -e "${BLUE}$1${NC}"
  echo -e "${BLUE}================================${NC}"
}

# 函数：打印成功信息
print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

# 函数：打印错误信息
print_error() {
  echo -e "${RED}✗ $1${NC}"
}

# 函数：打印警告信息
print_warning() {
  echo -e "${YELLOW}⚠ $1${NC}"
}

# 函数：检查依赖
check_dependencies() {
  print_header "检查依赖"

  # 检查 Node.js
  if ! command -v node &> /dev/null; then
    print_error "Node.js 未安装"
    echo "请访问 https://nodejs.org 安装 Node.js"
    exit 1
  fi
  print_success "Node.js 已安装: $(node --version)"

  # 检查 npm
  if ! command -v npm &> /dev/null; then
    print_error "npm 未安装"
    exit 1
  fi
  print_success "npm 已安装: $(npm --version)"

  # 检查 Playwright
  if ! npm list @playwright/test > /dev/null 2>&1; then
    print_warning "Playwright 未安装，正在安装..."
    npm install -D @playwright/test playwright
    npx playwright install
    print_success "Playwright 安装完成"
  else
    print_success "Playwright 已安装"
  fi

  # 检查 k6
  if ! command -v k6 &> /dev/null; then
    print_warning "k6 未安装"
    echo -e "${YELLOW}如需 API 测试，请安装 k6:${NC}"
    if [[ "$OSTYPE" == "darwin"* ]]; then
      echo "  brew install k6"
    else
      echo "  访问 https://k6.io/docs/getting-started/installation/"
    fi
    echo ""
  else
    print_success "k6 已安装: $(k6 --version)"
  fi

  echo ""
}

# 函数：检查前端服务
check_frontend_service() {
  print_header "检查前端服务"

  if curl -s http://localhost:3000 > /dev/null; then
    print_success "前端应用正在运行: http://localhost:3000"
  else
    print_error "前端应用未运行"
    echo -e "${YELLOW}请先启动前端应用:${NC}"
    echo "  cd /Users/mingjiexing/Desktop/ADVchatbot/frontend"
    echo "  npm run dev"
    echo ""
    read -p "继续？(y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      exit 1
    fi
  fi
  echo ""
}

# 函数：运行 UI 测试
run_ui_test() {
  print_header "运行前端 UI 压力测试"
  echo -e "${YELLOW}准备开始 UI 测试:${NC}"
  echo "  • 并发用户: 10"
  echo "  • 测试网址: http://localhost:3000/chat"
  echo "  • 测试消息: 你好，我需要帮助"
  echo ""
  
  read -p "继续？(y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    return
  fi

  npx ts-node load-test/playwright-ui-test.ts
  
  if [ $? -eq 0 ]; then
    print_success "UI 测试完成！"
    echo -e "${YELLOW}结果已保存到: load-test/playwright-report.json${NC}"
  else
    print_error "UI 测试失败"
    exit 1
  fi
  echo ""
}

# 函数：运行 API 测试
run_api_test() {
  if ! command -v k6 &> /dev/null; then
    print_error "k6 未安装，无法运行 API 测试"
    echo -e "${YELLOW}请先安装 k6:${NC}"
    if [[ "$OSTYPE" == "darwin"* ]]; then
      echo "  brew install k6"
    else
      echo "  访问 https://k6.io/docs/getting-started/installation/"
    fi
    return
  fi

  print_header "运行后端 API 压力测试"
  echo -e "${YELLOW}准备开始 API 测试:${NC}"
  echo "  • 并发用户: 逐步增加到 10"
  echo "  • 持续时间: 60 秒"
  echo "  • 测试 URL: http://localhost:3000/api"
  echo ""
  
  read -p "继续？(y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    return
  fi

  k6 run load-test/k6-api-test.js
  
  if [ $? -eq 0 ]; then
    print_success "API 测试完成！"
  else
    print_error "API 测试失败"
  fi
  echo ""
}

# 函数：查看结果
view_results() {
  print_header "查看测试结果"
  
  echo -e "${YELLOW}选择查看方式:${NC}"
  echo "1) 打开可视化仪表板 (HTML)"
  echo "2) 查看 JSON 详细报告"
  echo "3) 查看命令行摘要"
  echo "4) 返回"
  
  read -p "请选择 (1-4): " choice
  
  case $choice in
    1)
      if command -v open &> /dev/null; then
        open load-test/dashboard.html
      elif command -v xdg-open &> /dev/null; then
        xdg-open load-test/dashboard.html
      else
        print_error "无法自动打开浏览器，请手动打开:"
        echo "file://$(pwd)/load-test/dashboard.html"
      fi
      ;;
    2)
      if [ -f load-test/playwright-report.json ]; then
        cat load-test/playwright-report.json | jq '.'
      else
        print_error "未找到报告文件，请先运行测试"
      fi
      ;;
    3)
      if [ -f load-test/playwright-report.json ]; then
        echo ""
        jq '.summary' load-test/playwright-report.json
        echo ""
        echo -e "${YELLOW}详细指标:${NC}"
        jq '.metrics' load-test/playwright-report.json
      else
        print_error "未找到报告文件，请先运行测试"
      fi
      ;;
    4)
      return
      ;;
    *)
      print_error "无效选择"
      ;;
  esac
}

# 主菜单
main_menu() {
  while true; do
    print_header "聊天机器人压力测试工具"
    echo ""
    echo -e "${YELLOW}选择操作:${NC}"
    echo "1) 检查依赖和环境"
    echo "2) 运行前端 UI 压力测试"
    echo "3) 运行后端 API 压力测试"
    echo "4) 同时运行两种测试"
    echo "5) 查看测试结果"
    echo "6) 清除报告文件"
    echo "7) 打开文档"
    echo "8) 退出"
    echo ""
    
    read -p "请选择 (1-8): " choice
    
    case $choice in
      1)
        check_dependencies
        check_frontend_service
        ;;
      2)
        check_frontend_service
        run_ui_test
        ;;
      3)
        check_frontend_service
        run_api_test
        ;;
      4)
        check_frontend_service
        print_warning "将同时运行 UI 和 API 测试，这会持续约 1-2 分钟"
        read -p "继续？(y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
          run_ui_test &
          sleep 3
          run_api_test
          wait
        fi
        ;;
      5)
        view_results
        ;;
      6)
        read -p "确定要删除所有报告文件吗？(y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
          rm -f load-test/playwright-report.json load-test/k6-results.json
          print_success "报告文件已删除"
        fi
        ;;
      7)
        if command -v open &> /dev/null; then
          open load-test/README.md
        else
          cat load-test/README.md | less
        fi
        ;;
      8)
        print_success "退出测试工具"
        exit 0
        ;;
      *)
        print_error "无效选择"
        ;;
    esac
    
    echo ""
    read -p "按 Enter 继续..."
  done
}

# 启动脚本
check_dependencies
main_menu
