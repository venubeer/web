package com.baxter.blink.servlets;

import java.io.IOException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import com.baxter.common.utilities.StringUtil;

public class LoginFilter implements Filter {
	/* (non-Java-doc)
	 * @see java.lang.Object#Object()
	 */
	public LoginFilter() {
		super();
	}

	/* (non-Java-doc)
	 * @see javax.servlet.Filter#init(FilterConfig config)
	 */
	public void init(FilterConfig config) throws ServletException {
		// TODO Auto-generated method stub
	}

	/* (non-Java-doc)
	 * @see javax.servlet.Filter#doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
	 */
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		HttpServletRequest hreq = (HttpServletRequest) request;
		if (!StringUtil.isEmpty(request.getParameter("j_username")) && 
				!StringUtil.isEmpty(request.getParameter("j_password"))){
			hreq.getSession().setAttribute("blink.userId",request.getParameter("j_username"));
			hreq.getSession().setAttribute("blink.password",request.getParameter("j_password"));
		}
		chain.doFilter(request, response);  
	}

	/* (non-Java-doc)
	 * @see javax.servlet.Filter#destroy()
	 */
	public void destroy() {
		// TODO Auto-generated method stub
	}

}